<script>
	export let node;
	let collapsed = false;

	const isElement = node.nodeType === 1; // DOM API standard
	const isText = node.nodeType === 3 && node.nodeValue.trim() !== '';
	const hasChildren = node.childNodes && node.childNodes.length > 0;
</script>

<div class="node-wrapper">
	{#if isElement}
		<div class="tag-line">
			{#if hasChildren}
				<button class="toggle" on:click={() => (collapsed = !collapsed)}>
					{collapsed ? '▶' : '▼'}
				</button>
			{/if}

			<span class="punctuation">&lt;</span>
			<span class="tag-name">{node.tagName.toLowerCase()}</span>

			{#each Array.from(node.attributes) as attr}
				<span class="attr-name"> {attr.name}</span>
				<span class="punctuation">=</span>
				<span class="attr-value">"{attr.value}"</span>
			{/each}

			<span class="punctuation">&gt;</span>
		</div>

		{#if !collapsed && hasChildren}
			<div class="children">
				{#each Array.from(node.childNodes) as child}
					<svelte:self node={child} />
				{/each}
			</div>

			<div class="tag-line">
				<span class="punctuation">&lt;/</span>
				<span class="tag-name">{node.tagName.toLowerCase()}</span>
				<span class="punctuation">&gt;</span>
			</div>
		{/if}
	{:else if isText}
		<div class="text-content">{node.nodeValue}</div>
	{/if}
</div>

<style>
	.node-wrapper {
		font-family: 'Fira Code', monospace;
		font-size: 14px;
		margin-left: 1rem;
	}
	.tag-line {
		display: flex;
		align-items: center;
		white-space: nowrap;
	}
	.toggle {
		background: none;
		border: none;
		cursor: pointer;
		color: #888;
		width: 20px;
		font-size: 10px;
	}
	.tag-name {
		color: #e06c75;
	}
	.attr-name {
		color: #d19a66;
		margin-left: 4px;
	}
	.attr-value {
		color: #98c379;
	}
	.punctuation {
		color: #abb2bf;
	}
	.text-content {
		color: #abb2bf;
		margin-left: 20px;
		white-space: pre-wrap;
	}
	.children {
		border-left: 1px solid #3e4451;
		margin-left: 10px;
	}
</style>
