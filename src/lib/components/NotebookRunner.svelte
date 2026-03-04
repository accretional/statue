<script>
	import { browser } from '$app/environment';
	import { marked } from 'marked';
	import hljs from 'highlight.js/lib/core';
	import python from 'highlight.js/lib/languages/python';

	// Register Python language
	hljs.registerLanguage('python', python);

	let { src = null, notebook = null } = $props();

	let cells = $state([]);
	let pyodideReady = $state(false);
	let pyodideLoading = $state(false);
	let pyodideInitialized = $state(false);
	let statusMessage = $state('Click Run to initialize Python runtime');
	let executionCount = $state(0);
	/** @type {Worker | null} */
	let worker = $state(null);
	let editingCellId = $state(null);

	// Parse notebook JSON into cell structure
	function parseNotebook(nb) {
		if (!nb || !nb.cells) return [];

		return nb.cells.map((cell, index) => ({
			id: `cell-${index}`,
			cell_type: cell.cell_type,
			source: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
			execution_count: null,
			outputs: { stdout: '', stderr: '', result: null, images: [] },
			collapsed: false,
			running: false
		}));
	}

	// Load notebook from URL
	async function loadNotebook(url) {
		try {
			const response = await fetch(url);
			const nb = await response.json();
			cells = parseNotebook(nb);
		} catch (error) {
			console.error('Failed to load notebook:', error);
		}
	}

	// Initialize web worker (lazy - only called on first run)
	function initWorker() {
		if (!browser || worker) return Promise.resolve();

		return new Promise((resolve) => {
			pyodideLoading = true;
			statusMessage = 'Loading Pyodide...';

			const workerCode = `let pyodide = null;
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/';

async function initPyodide() {
	postMessage({ type: 'status', message: 'Loading Pyodide...' });
	importScripts(PYODIDE_CDN + 'pyodide.js');
	postMessage({ type: 'status', message: 'Initializing Python runtime...' });
	pyodide = await loadPyodide({ indexURL: PYODIDE_CDN });
	await pyodide.loadPackage('micropip');
	await pyodide.runPythonAsync(\`
import sys
from io import StringIO

_captured_images = []

def _setup_matplotlib():
    """Patch matplotlib to capture figures as base64 PNG"""
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        import base64
        from io import BytesIO

        plt.style.use('dark_background')
        matplotlib.rcParams['figure.facecolor'] = '#1a1a1a'
        matplotlib.rcParams['axes.facecolor'] = '#1a1a1a'
        matplotlib.rcParams['savefig.facecolor'] = '#1a1a1a'

        _original_show = plt.show

        def _patched_show(*args, **kwargs):
            global _captured_images
            for fig_num in plt.get_fignums():
                fig = plt.figure(fig_num)
                buf = BytesIO()
                fig.savefig(buf, format='png', dpi=100, bbox_inches='tight',
                           facecolor='#1a1a1a', edgecolor='none')
                buf.seek(0)
                img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                _captured_images.append(img_base64)
                buf.close()
            plt.close('all')

        plt.show = _patched_show
        return True
    except ImportError:
        return False

def _clear_captured_images():
    global _captured_images
    _captured_images = []

def _get_captured_images():
    global _captured_images
    return _captured_images.copy()
\`);

	postMessage({ type: 'status', message: 'Ready' });
	postMessage({ type: 'ready' });
}

function detectPackages(code) {
	const packages = new Set();
	const importRegex = /^\\s*(?:import|from)\\s+(\\w+)/gm;
	let match;

	while ((match = importRegex.exec(code)) !== null) {
		const pkg = match[1];
		const packageMap = {
			numpy: 'numpy',
			np: 'numpy',
			pandas: 'pandas',
			pd: 'pandas',
			matplotlib: 'matplotlib',
			plt: 'matplotlib',
			scipy: 'scipy',
			sklearn: 'scikit-learn',
			PIL: 'pillow',
			cv2: 'opencv-python',
			requests: 'requests',
			bs4: 'beautifulsoup4',
			yaml: 'pyyaml',
			json: null,
			math: null,
			random: null,
			os: null,
			sys: null,
			re: null,
			datetime: null,
			collections: null,
			itertools: null,
			functools: null
		};

		if (pkg in packageMap && packageMap[pkg] !== null) {
			packages.add(packageMap[pkg]);
		}
	}

	return Array.from(packages);
}

async function installPackages(packages) {
	if (packages.length === 0) return;

	const micropip = pyodide.pyimport('micropip');

	for (const pkg of packages) {
		try {
			postMessage({ type: 'status', message: 'Installing ' + pkg + '...' });
			await micropip.install(pkg);
		} catch (e) {
			console.warn('Failed to install ' + pkg + ':', e);
		}
	}
}

async function runCode(cellId, code) {
	if (!pyodide) {
		postMessage({ type: 'error', cellId, error: 'Pyodide not initialized' });
		return;
	}

	try {
		const packages = detectPackages(code);
		await installPackages(packages);

		if (packages.includes('matplotlib')) {
			await pyodide.runPythonAsync('_setup_matplotlib()');
		}

		await pyodide.runPythonAsync('_clear_captured_images()');

		await pyodide.runPythonAsync(\`
_stdout_capture = StringIO()
_stderr_capture = StringIO()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
\`);

		let result = null;
		try {
			result = await pyodide.runPythonAsync(code);
		} finally {
			await pyodide.runPythonAsync(\`
sys.stdout = _old_stdout
sys.stderr = _old_stderr
\`);
		}

		const stdout = await pyodide.runPythonAsync('_stdout_capture.getvalue()');
		const stderr = await pyodide.runPythonAsync('_stderr_capture.getvalue()');
		const images = await pyodide.runPythonAsync('_get_captured_images()');

		let resultStr = null;
		if (result !== undefined && result !== null) {
			const resultRepr = result.toString();
			if (resultRepr !== 'None') {
				resultStr = resultRepr;
			}
		}

		postMessage({
			type: 'result',
			cellId,
			stdout: stdout || '',
			stderr: stderr || '',
			result: resultStr,
			images: images ? images.toJs() : []
		});
	} catch (error) {
		postMessage({
			type: 'error',
			cellId,
			error: error.message || String(error)
		});
	}

	postMessage({ type: 'status', message: 'Ready' });
}

self.onmessage = async (event) => {
	const { type, cellId, code } = event.data;

	switch (type) {
		case 'init':
			await initPyodide();
			break;
		case 'run':
			await runCode(cellId, code);
			break;
		default:
			console.warn('Unknown message type:', type);
	}
};`;
			const blob = new Blob([workerCode], { type: 'application/javascript' });
			const workerUrl = URL.createObjectURL(blob);
			worker = new Worker(workerUrl);
			URL.revokeObjectURL(workerUrl);

			worker.onmessage = (event) => {
				const { type, cellId, stdout, stderr, result, images, error, message } = event.data;

				switch (type) {
					case 'ready':
						pyodideReady = true;
						pyodideLoading = false;
						pyodideInitialized = true;
						resolve();
						break;
					case 'status':
						statusMessage = message;
						break;
					case 'result':
						cells = cells.map((cell) => {
							if (cell.id === cellId) {
								return {
									...cell,
									outputs: { stdout, stderr, result, images },
									running: false
								};
							}
							return cell;
						});
						break;
					case 'error':
						cells = cells.map((cell) => {
							if (cell.id === cellId) {
								return {
									...cell,
									outputs: { stdout: '', stderr: error, result: null, images: [] },
									running: false
								};
							}
							return cell;
						});
						break;
				}
			};

			worker.postMessage({ type: 'init' });
		});
	}

	// Ensure Pyodide is initialized before running
	async function ensurePyodideReady() {
		if (!pyodideInitialized) {
			await initWorker();
		}
	}

	// Run a single cell
	async function runCell(cellId) {
		await ensurePyodideReady();
		if (!pyodideReady || !worker) return;

		const cell = cells.find((c) => c.id === cellId);
		if (!cell || cell.cell_type !== 'code') return;

		executionCount++;

		cells = cells.map((c) => {
			if (c.id === cellId) {
				return {
					...c,
					execution_count: executionCount,
					outputs: { stdout: '', stderr: '', result: null, images: [] },
					running: true
				};
			}
			return c;
		});

		worker.postMessage({ type: 'run', cellId, code: cell.source });
	}

	// Run all code cells sequentially
	async function runAll() {
		await ensurePyodideReady();
		if (!pyodideReady || !worker) return;

		const codeCells = cells.filter((c) => c.cell_type === 'code');

		for (const cell of codeCells) {
			executionCount++;

			cells = cells.map((c) => {
				if (c.id === cell.id) {
					return {
						...c,
						execution_count: executionCount,
						outputs: { stdout: '', stderr: '', result: null, images: [] },
						running: true
					};
				}
				return c;
			});

			// Send to worker and wait for result
			await new Promise((resolve) => {
				const handler = (event) => {
					if (
						(event.data.type === 'result' || event.data.type === 'error') &&
						event.data.cellId === cell.id
					) {
						worker?.removeEventListener('message', handler);
						resolve(undefined);
					}
				};
				worker?.addEventListener('message', handler);
				worker?.postMessage({ type: 'run', cellId: cell.id, code: cell.source });
			});
		}
	}

	// Toggle cell collapse
	function toggleCollapse(cellId) {
		cells = cells.map((c) => {
			if (c.id === cellId) {
				return { ...c, collapsed: !c.collapsed };
			}
			return c;
		});
	}

	// Update cell source
	function updateCellSource(cellId, newSource) {
		cells = cells.map((c) => {
			if (c.id === cellId) {
				return { ...c, source: newSource };
			}
			return c;
		});
	}

	// Highlight Python code
	function highlightCode(code) {
		return hljs.highlight(code, { language: 'python' }).value;
	}

	// Render markdown
	function renderMarkdown(text) {
		return marked(text);
	}

	// Initialize notebook data on mount (NOT Pyodide)
	$effect(() => {
		if (browser) {
			if (src) {
				loadNotebook(src);
			} else if (notebook) {
				cells = parseNotebook(notebook);
			}
		}
	});

	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (worker) {
				worker.terminate();
			}
		};
	});
</script>

<div class="notebook-runner">
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="status">
			{#if pyodideLoading}
				<span class="status-indicator loading"></span>
				<span>{statusMessage}</span>
			{:else if pyodideReady}
				<span class="status-indicator ready"></span>
				<span>{statusMessage}</span>
			{:else}
				<span class="status-indicator idle"></span>
				<span>{statusMessage}</span>
			{/if}
		</div>
		<div class="actions">
			<button class="run-all-btn" onclick={runAll} disabled={pyodideLoading}>
				{pyodideLoading ? 'Initializing...' : 'Run All'}
			</button>
		</div>
	</div>

	<!-- Cells -->
	<div class="cells">
		{#each cells as cell (cell.id)}
			<div class="cell {cell.cell_type}" class:collapsed={cell.collapsed}>
				<!-- Cell header -->
				<div class="cell-header">
					<button class="collapse-btn" onclick={() => toggleCollapse(cell.id)}>
						{cell.collapsed ? '▶' : '▼'}
					</button>

					{#if cell.cell_type === 'code'}
						<span class="execution-count">
							[{cell.running ? '*' : cell.execution_count || ' '}]
						</span>
						<button
							class="run-btn"
							onclick={() => runCell(cell.id)}
							disabled={pyodideLoading || cell.running}
						>
							{cell.running ? 'Running...' : 'Run'}
						</button>
					{:else}
						<span class="cell-type-label">{cell.cell_type}</span>
					{/if}
				</div>

				<!-- Cell content -->
				{#if !cell.collapsed}
					<div class="cell-content">
						{#if cell.cell_type === 'code'}
							<!-- Code cell -->
							{#if editingCellId === cell.id}
								<textarea
									class="code-editor"
									value={cell.source}
									oninput={(e) => updateCellSource(cell.id, e.target.value)}
									onblur={() => (editingCellId = null)}
									spellcheck="false"
								></textarea>
							{:else}
								<pre
									class="code-display"
									onclick={() => (editingCellId = cell.id)}
									role="button"
									tabindex="0"
									onkeydown={(e) => e.key === 'Enter' && (editingCellId = cell.id)}>{@html highlightCode(cell.source)}</pre>
							{/if}

							<!-- Outputs -->
							{#if cell.outputs.stdout || cell.outputs.stderr || cell.outputs.result || cell.outputs.images.length > 0}
								<div class="outputs">
									{#if cell.outputs.stdout}
										<pre class="stdout">{cell.outputs.stdout}</pre>
									{/if}
									{#if cell.outputs.stderr}
										<pre class="stderr">{cell.outputs.stderr}</pre>
									{/if}
									{#if cell.outputs.result}
										<pre class="result">{cell.outputs.result}</pre>
									{/if}
									{#if cell.outputs.images.length > 0}
										<div class="images">
											{#each cell.outputs.images as img}
												<img src="data:image/png;base64,{img}" alt="Plot output" />
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						{:else if cell.cell_type === 'markdown'}
							<!-- Markdown cell -->
							<div class="markdown-content">
								{@html renderMarkdown(cell.source)}
							</div>
						{:else}
							<!-- Raw cell -->
							<pre class="raw-content">{cell.source}</pre>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.notebook-runner {
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: var(--color-card);
		border-bottom: 1px solid var(--color-border);
	}

	.status {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-muted);
		font-size: 14px;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.status-indicator.loading {
		background: #f59e0b;
		animation: pulse 1s infinite;
	}

	.status-indicator.ready {
		background: #10b981;
	}

	.status-indicator.idle {
		background: #6b7280;
	}

	.status-indicator.error {
		background: #ef4444;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.actions {
		display: flex;
		gap: 8px;
	}

	.run-all-btn {
		padding: 6px 16px;
		background: var(--color-prose-code-bg, #333);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.run-all-btn:hover:not(:disabled) {
		background: var(--color-border);
	}

	.run-all-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cells {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.cell {
		border: 1px solid var(--color-border);
		border-radius: 6px;
		overflow: hidden;
	}

	.cell.code {
		background: var(--color-card);
	}

	.cell.markdown {
		background: var(--color-background);
	}

	.cell-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid var(--color-border);
	}

	.collapse-btn {
		background: none;
		border: none;
		color: var(--color-muted);
		cursor: pointer;
		padding: 0;
		font-size: 12px;
		width: 16px;
	}

	.execution-count {
		font-family: monospace;
		color: var(--color-muted);
		font-size: 12px;
		min-width: 32px;
	}

	.cell-type-label {
		font-size: 12px;
		color: var(--color-muted);
		text-transform: uppercase;
	}

	.run-btn {
		margin-left: auto;
		padding: 4px 12px;
		background: var(--color-prose-code-bg);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		transition: background 0.2s;
	}

	.run-btn:hover:not(:disabled) {
		background: var(--color-border);
	}

	.run-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cell-content {
		padding: 0;
	}

	.cell.collapsed .cell-header {
		border-bottom: none;
	}

	.code-editor {
		width: 100%;
		min-height: 100px;
		padding: 12px;
		background: var(--color-card);
		color: var(--color-foreground);
		border: none;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 14px;
		line-height: 1.5;
		resize: vertical;
		outline: none;
	}

	.code-display {
		margin: 0;
		padding: 12px;
		background: var(--color-card);
		color: var(--color-foreground);
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 14px;
		line-height: 1.5;
		overflow-x: auto;
		cursor: text;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.code-display:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.outputs {
		border-top: 1px solid var(--color-border);
		padding: 12px;
		background: rgba(0, 0, 0, 0.2);
	}

	.stdout,
	.result {
		margin: 0;
		padding: 8px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 13px;
		line-height: 1.4;
		color: var(--color-foreground);
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.stderr {
		margin: 0;
		padding: 8px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 13px;
		line-height: 1.4;
		color: #ff6b6b;
		background: rgba(255, 107, 107, 0.1);
		border-radius: 4px;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.images {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 8px;
	}

	.images img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
	}

	.markdown-content {
		padding: 16px;
		color: var(--color-foreground);
		line-height: 1.6;
	}

	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		margin-top: 0;
		margin-bottom: 12px;
		color: var(--color-foreground);
	}

	.markdown-content :global(p) {
		margin: 0 0 12px 0;
	}

	.markdown-content :global(code) {
		background: var(--color-prose-code-bg);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.markdown-content :global(pre) {
		background: var(--color-prose-code-bg);
		padding: 12px;
		border-radius: 6px;
		overflow-x: auto;
	}

	.raw-content {
		margin: 0;
		padding: 12px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 14px;
		color: var(--color-muted);
	}

	/* Highlight.js theme overrides for dark mode */
	:global(.hljs) {
		background: transparent !important;
	}

	:global(.hljs-keyword) {
		color: #c678dd;
	}

	:global(.hljs-string) {
		color: #98c379;
	}

	:global(.hljs-number) {
		color: #d19a66;
	}

	:global(.hljs-built_in) {
		color: #e5c07b;
	}

	:global(.hljs-function) {
		color: #61afef;
	}

	:global(.hljs-comment) {
		color: #5c6370;
		font-style: italic;
	}

	:global(.hljs-params) {
		color: #abb2bf;
	}
</style>
