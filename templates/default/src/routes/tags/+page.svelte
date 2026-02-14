<script>
	import PageHero from 'statue-ssg/components/PageHero.svelte';
import TagList from 'statue-ssg/components/TagList.svelte';

	const { data } = $props();
	const tags = $derived(data.tags || []);
</script>

<svelte:head>
	<title>All Tags</title>
	<meta name="description" content="Browse posts by topic" />
</svelte:head>

<div class="container mx-auto px-4 pt-20">
	<div class="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4">
		<a href="/" class="hover:text-[var(--color-primary)]">Home</a>
		<span>/</span>
		<span>Tags</span>
	</div>
</div>

<PageHero
	title="All Tags"
	description="Browse posts by topic"
/>

<div class="container mx-auto px-4 pb-16">
	<div class="max-w-4xl mx-auto">
		{#if tags.length > 0}
			<TagList {tags} />
		{:else}
			<p class="text-[var(--color-muted)]">No tags found.</p>
		{/if}
	</div>
</div>
