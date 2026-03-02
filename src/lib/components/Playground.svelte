<script lang="ts">
	let code = $state('console.log("Hello JavaScript!");');
	let output = $state('');
	let language = $state('javascript');
	let isLoading = $state(false);

	const templates: Record<string, string> = {
		javascript: 'console.log("Hello JavaScript!");\nconsole.log(2 + 2);',
		typescript: 'const message: string = "Hello TypeScript!";\nconsole.log(message);',
		python: 'print("Hello Python!")\nprint(2 + 2)',
		ruby: 'puts "Hello Ruby!"\nputs 2 + 2',
		c: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}',
		java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
		bash: 'echo "Hello Bash!"\nls -la',
		ocaml: 'print_endline "Hello OCaml!";'
	};

	function changeLanguage(e: Event) {
		const select = e.target as HTMLSelectElement;
		language = select.value;
		code = templates[language];
		output = '';
	}

	async function runCode() {
		isLoading = true;
		output = '';

		// JS runs locally in the browser
		if (language === 'javascript') {
			runLocalJS();
		} else {
			await runRemoteCode();
		}

		isLoading = false;
	}

	function runLocalJS() {
		const logs: string[] = [];
		const originalLog = console.log;
		const originalError = console.error;

		// console.log push to logs array instead of browser console
		console.log = (...args) => {
			logs.push(
				args
					.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
					.join(' ')
			);
		};
		console.error = (...args) => {
			logs.push('ERROR: ' + args.map((a) => String(a)).join(' '));
		};

		try {
			new Function(code)();
		} catch (err) {
			console.error(err);
		} finally {
			console.log = originalLog;
			console.error = originalError;
			output = logs.join('\n');
		}
	}

	async function runRemoteCode() {
		try {
			// Send code to Piston (code execution API)
			const response = await fetch('https://emkc.org/api/v2/piston/execute', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					language: language,
					version: '*',
					files: [{ content: code }]
				})
			});

			const result = await response.json();

			if (result.run) {
				output = result.run.output;
			} else {
				output = 'Error: Failed to execute code.';
			}
		} catch (e) {
			output = 'Network Error: Could not connect to compiler API.';
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="playground-card">
	<div class="window-header">
		<div class="center-title">
			<select onchange={changeLanguage} class="lang-select">
				<option value="javascript">JavaScript</option>
				<option value="typescript">TypeScript</option>
				<option value="python">Python</option>
				<option value="ruby">Ruby</option>
				<option value="java">Java</option>
				<option value="c">C</option>
				<option value="bash">Bash</option>
				<option value="ocaml">OCaml</option>
			</select>
		</div>

		<div class="actions">
			<button onclick={runCode} disabled={isLoading} class="run-btn">
				<span class="icon">▶</span>
				{isLoading ? '...' : 'Run'}
			</button>
		</div>
	</div>

	<div class="editor-area">
		<div class="gutter">
			<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
		</div>
		<textarea
			bind:value={code}
			spellcheck="false"
			class={language}
			placeholder="Type your code here..."
		></textarea>
	</div>

	<div class="terminal">
		<div class="terminal-header">TERMINAL OUTPUT</div>
		<pre>{output || '> Ready for input...'}</pre>
	</div>
</div>

<style>
	.playground-card {
		display: flex;
		flex-direction: column;
		height: 550px;
		border-radius: 12px;
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		margin: 2rem auto;
		max-width: 900px;
		background: #1e1e1e;
		box-shadow:
			0 20px 40px -10px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.window-header {
		height: 48px;
		background: #252526;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		border-bottom: 1px solid #333;
	}

	.lang-select {
		background: transparent;
		color: #ccc;
		border: 1px solid transparent;
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 6px;
		transition: all 0.2s;
	}
	.lang-select:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}
	.lang-select:focus {
		outline: none;
		background: rgba(255, 255, 255, 0.1);
	}
	.lang-select option {
		background: #252526;
		color: white;
	}

	.run-btn {
		background: #cc0000;
		color: white;
		border: none;
		padding: 6px 18px;
		border-radius: 6px;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 6px;
		transition:
			transform 0.1s,
			background 0.2s;
	}
	.run-btn:hover {
		background: #ff1a1a;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);
	}
	.run-btn:active {
		transform: translateY(0);
	}
	.run-btn:disabled {
		background: #555;
		cursor: not-allowed;
	}

	.editor-area {
		flex: 1;
		display: flex;
		background: #1e1e1e;
		position: relative;
	}

	.gutter {
		width: 40px;
		background: #1e1e1e;
		color: #555;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 1.5rem;
		font-size: 13px;
		line-height: 1.6;
		border-right: 1px solid #252526;
		user-select: none;
	}
	.gutter span {
		display: block;
	}

	textarea {
		flex: 1;
		padding: 1.5rem;
		border: none;
		resize: none;
		outline: none;
		font-family: inherit;
		font-size: 14px;
		line-height: 1.6;
		color: #e0e0e0;
		background: transparent;
	}

	.terminal {
		height: 160px;
		background: #151515;
		border-top: 1px solid #333;
		display: flex;
		flex-direction: column;
	}

	.terminal-header {
		font-size: 0.7rem;
		padding: 8px 1rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
		user-select: none;
	}

	pre {
		margin: 0;
		padding: 0 1rem 1rem 1rem;
		font-family: inherit;
		color: #4af626;
		font-size: 0.9rem;
		overflow-y: auto;
		flex: 1;
	}
</style>
