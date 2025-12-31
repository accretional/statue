<script>
	const { rootContent } = $props();
	const title = 'Latest Content';
	const readMoreText = 'Read more';
</script>

{#if rootContent && rootContent.length > 0}
	<div class="max-w-6xl mx-auto my-18">
		<div class="text-center mb-10">
			<h2 class="mb-4">
				{title}
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each rootContent as page}
				<div class="relative bg-card rounded-xl p-8 transition-all duration-300">
					<a
						href={page.url}
						class="inline-flex items-center text-foreground font-medium transition-all"
					>
						<div class="relative">
							<div class="size-6 rounded-lg flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-6 text-muted"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"
									/>
								</svg>
							</div>
							<h3 class="mb-4">{page.metadata.title}</h3>
							{#if page.metadata.description}
								<p class="text-muted mb-4">{page.metadata.description}</p>
							{/if}
							<div class="flex items-center group">
								<p class="text-muted hover:text-foreground">
									{readMoreText}
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
