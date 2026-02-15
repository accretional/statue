<script>
	import { browser } from '$app/environment';
	import XmlNode from './XmlNode.svelte';

	export let xmlString = '';

	let doc, error;

	$: if (browser && xmlString) {
		const parser = new DOMParser();
		const parsed = parser.parseFromString(xmlString, 'application/xml');
		const errNode = parsed.querySelector('parsererror');

		if (errNode) {
			error = errNode.textContent;
			doc = null;
		} else {
			doc = parsed.documentElement;
			error = null;
		}
	}
</script>

<div class="xml-container">
	{#if error}
		<div class="error">Parsing Error: {error}</div>
	{:else if doc}
		<XmlNode node={doc} />
	{:else}
		<p class="empty">Waiting for XML...</p>
	{/if}
</div>

<style>
	.xml-container {
		background: #282c34;
		color: #abb2bf;
		padding: 1.5rem;
		overflow-x: auto;
		font-family: 'Fira Code', monospace;
		font-size: 14px;
		min-height: 100px; /* Prevent collapse while loading */
	}
	.error {
		color: #e06c75;
		background: rgba(224, 108, 117, 0.1);
		padding: 1rem;
		border-radius: 4px;
	}
	.empty {
		color: #5c6370;
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}
</style>
