<script>
	let title = 'Categories';
	let viewContentText = 'View';

	const { directories = [] } = $props();
</script>

{#if directories && directories.length > 0}
	<div id="directories" class="max-w-6xl mx-auto my-18">
		<div class="text-center mb-10">
			<h2 class="mb-4">
				{title}
			</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each directories as directory}
				<div class=" relative bg-card rounded-xl p-8 transition-all duration-300">
					<a
						href={directory.url}
						class="inline-flex items-center text-foreground font-medium transition-all"
					>
						<div class="relative">
							<div class="size-6 rounded-lg flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-6 text-muted"
									viewBox="0 0 24 24"
								>
									<path fill="currentColor" d="M4 8h16v10H4z" opacity=".3" /><path
										fill="currentColor"
										d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V8h16z"
									/>
								</svg>
							</div>
							<h3 class="mb-4">{directory.title}</h3>

							<div class="flex items-center group">
								<p class="text-muted hover:text-foreground">
									{viewContentText}
								</p>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-5 relative translate-y-0.5 transition-transform"
									viewBox="0 0 24 24"
								>
									<path class="opacity-50" fill="currentColor" d="M10 17V7l5 5z" />
									<path
										class="absolute group-hover:translate-x-2 transition-transform"
										fill="currentColor"
										d="M10 17V7l5 5z"
									/>
								</svg>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
{/if}
