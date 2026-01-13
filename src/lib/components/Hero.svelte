<script>
	let badgeText =
		'<a href="https://github.com/accretional/statue" target="_blank">✨ Powered by Statue SSG</a>';
	let titleLine1 = 'Welcome to Your Site!';
	let titleLine2 =
		'(Statue <img src="/favicon.png" alt="Statue" class="inline-block w-16 h-16 align-middle" /> Default)';
	let description =
		'Create amazing static sites easily with Statue using Markdown and Svelte. Fast, secure, and SEO-friendly sites ready in minutes.';
	let primaryButtonText = 'Explore Content';
	let primaryButtonLink = '#directories';
	let secondaryButtonText = 'Documentation';
	let secondaryButtonLink = '/docs';
</script>

<div class="pt-20 pb-16 md:pt-32">
	<div class="max-w-5xl mx-auto text-center relative">
		<div class="relative z-10">
			<div
				class="inline-flex items-center px-4 py-1.5 rounded-full bg-card border border-border mb-8"
			>
				<span class="text-sm font-medium">{@html badgeText}</span>
			</div>

			<h1 class="text-5xl md:text-7xl font-light mb-8 tracking-tighter leading-tight">
				<span class="text-primary">
					{titleLine1}<br />
				</span>
				<span class="italic">
					{@html titleLine2}
				</span>
			</h1>

			<p class="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
				{description}
			</p>

			<div class="flex flex-col sm:flex-row justify-center gap-4">
				<a
					href={primaryButtonLink}
					class="group px-8 py-4 bg-primary hover:bg-primary/80 text-on-primary rounded-xl overflow-hidden transition-all duration-300"
				>
					{primaryButtonText}
				</a>
				<a
					href={secondaryButtonLink}
					class="group px-8 py-4 bg-card/50 rounded-xl border border-border hover:border/50 hover:bg-card transition-colors inline-flex items-center justify-center"
				>
					{secondaryButtonText}
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
				</a>
			</div>
		</div>
	</div>
</div>
