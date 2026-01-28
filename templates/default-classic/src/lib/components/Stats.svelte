<script>
	let stats = [
		{
			title: 'Fast',
			description: 'Put your content on a static site in seconds'
		},
		{
			title: 'Simple',
			description: "Just write Markdown, we'll handle the rest"
		},
		{
			title: 'Secure',
			description: 'Static sites require no server maintenance or configuration'
		}
	];
</script>

<div class="py-8">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each stats as stat}
				<div
					class="group relative bg-card/80 backdrop-blur-sm rounded-2xl py-8 px-7 transition-all duration-300"
				>
					<div class="relative">
						<h3 class="font-light mb-4">
							{stat.title}
						</h3>
						<p class="text-muted leading-relaxed">{stat.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
