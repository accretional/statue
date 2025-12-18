<script>
	// WhyChooseUs component - Why choose us section
	export let title = 'Why Choose Statue SSG';
	export let features = [
		{
			title: 'Developer-Friendly',
			description:
				'Built on Svelte and modern web standards with developers in mind. Extend and customize with ease.'
		},
		{
			title: 'Blazing Fast',
			description:
				'Generate optimized static sites that load instantly and score high on performance metrics.'
		},
		{
			title: 'Content-Focused',
			description:
				'Focus on writing in Markdown while we handle the technical details, or customize away.'
		},
		{
			title: 'SEO Optimized',
			description: 'Built-in SEO features to help your content rank higher in search engines.'
		}
	];
</script>

<div class="mx-auto mt-24 mb-8 max-w-5xl">
	<h2 class="mb-10 text-center">
		{title}
	</h2>
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		{#each features as feature (feature.title)}
			<div
				class="rounded-xl border border-(--divider) bg-(--bg)/50 p-8 backdrop-blur-sm transition-all duration-300"
			>
				<h3 class="mb-3 text-xl font-bold">{feature.title}</h3>
				<p class="text-(--text-2)">{feature.description}</p>
			</div>
		{/each}
	</div>
</div>
