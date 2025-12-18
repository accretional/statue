<script>
	// PageHero component - Page header section (for about, docs, etc.)
	export let title = '';
	export let description = '';
</script>

<div class="container mx-auto px-4 pt-12">
	<div class="mx-auto max-w-4xl text-center">
		<h1 class="text- mb-6 text-4xl font-bold md:text-5xl">
			{title}
		</h1>
		{#if description}
			<p class="mb-8 text-xl text-gray-300">
				{description}
			</p>
		{/if}
	</div>
</div>
