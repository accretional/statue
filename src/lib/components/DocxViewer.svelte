<script lang="ts">
	import { onMount } from 'svelte';
	import { renderAsync } from 'docx-preview';

	// Props
	export let src: string | null = null; // URL/path to fetch
	export let file: Blob | File | null = null; // File/Blob object to render
	export let className: string = 'docx'; // CSS class for the document
	export let breakPages: boolean = true; // Whether to break pages

	// State
	let container: HTMLElement;
	let loading = true;
	let error: string | null = null;

	// Lifecycle
	onMount(async () => {
		if (!src && !file) {
			error = 'No document source provided. Use src or file prop.';
			loading = false;
			return;
		}

		try {
			let docData: Blob | ArrayBuffer;

			if (file) {
				docData = file;
			} else if (src) {
				const response = await fetch(src);
				if (!response.ok) {
					throw new Error(`Failed to fetch document: ${response.statusText}`);
				}
				docData = await response.arrayBuffer();
			} else {
				throw new Error('No document source');
			}

			await renderAsync(docData, container, undefined, {
				className,
				breakPages,
				inWrapper: true,
				ignoreWidth: false,
				ignoreHeight: false,
				ignoreFonts: false,
				renderHeaders: true,
				renderFooters: true,
				renderFootnotes: true,
				renderEndnotes: true
			});

			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load document';
			loading = false;
		}
	});
</script>

<div class="docx-viewer">
	{#if loading}
		<div class="loading">
			<span class="spinner"></span>
			<span>Loading document...</span>
		</div>
	{/if}

	{#if error}
		<div class="error">
			<span>Error: {error}</span>
		</div>
	{/if}

	<div bind:this={container} class="doc-container" class:hidden={loading || error}></div>
</div>

<style>
	.docx-viewer {
		width: 100%;
		min-height: 200px;
		background: var(--color-background, #fff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 8px;
		overflow: hidden;
	}

	.doc-container {
		width: 100%;
		overflow: auto;
	}

	.doc-container.hidden {
		display: none;
	}

	.loading,
	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 2rem;
		color: var(--color-muted, #6b7280);
	}

	.error {
		color: var(--color-error, #ef4444);
	}

	.spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--color-border, #e5e7eb);
		border-top-color: var(--color-primary, #3b82f6);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Override docx-preview wrapper styles for better integration */
	:global(.docx-viewer .docx-wrapper) {
		background: var(--color-background, #f9fafb);
		padding: 1rem;
	}

	:global(.docx-viewer .docx) {
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin: 0 auto;
	}
</style>
