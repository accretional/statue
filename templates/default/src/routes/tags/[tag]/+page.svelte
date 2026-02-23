<script>
	import PageHero from 'statue-ssg/components/PageHero.svelte';
import BlogLayout from 'statue-ssg/components/BlogLayout.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.pageTitle}</title>
	<meta name="description" content="Posts tagged with {data.tag}" />
</svelte:head>

<div class="container mx-auto px-4 pt-20">
	<div class="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4">
		<a href="/" class="hover:text-[var(--color-primary)]">Home</a>
		<span>/</span>
		<a href="/blog" class="hover:text-[var(--color-primary)]">Blog</a>
		<span>/</span>
		<a href="/tags" class="hover:text-[var(--color-primary)]">Tags</a>
		<span>/</span>
		<span>{data.tag}</span>
	</div>
</div>

<PageHero
	title={`Posts tagged "${data.tag}"`}
	description={`Found ${data.posts.length} ${data.posts.length === 1 ? 'post' : 'posts'}`}
/>

<BlogLayout title="" posts={data.posts} />
