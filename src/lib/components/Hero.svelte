<script>
	import Button from '$lib/components/ui/Button.svelte';

	// Hero component - Homepage hero section
	const badgeText =
		'<a href="https://github.com/accretional/statue" target="_blank">✨ Powered by Statue SSG</a>';
	const titleLine1 = 'Welcome!';
	const titleLine2 = 'To your website';
	const description =
		'Create amazing static sites easily with Statue SSG using Markdown and Svelte. Fast, secure, and SEO-friendly sites ready in minutes.';
	const secondaryButtonText = 'Explore Content';
	const secondaryButtonLink = '#directories';
	const primaryButtonText = 'Documentation';
	const primaryButtonLink = '/docs';
</script>

<div class="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-20">
	<div class="relative mx-auto max-w-5xl text-center">
		<div>
			<h1 class=" mb-8 tracking-tight">
				{titleLine1}
				<br />
				{titleLine2}
			</h1>

			<p class=" mx-auto mb-6 max-w-[50ch] leading-relaxed">
				{description}
			</p>

			<div class="space-x-2">
				<Button href={primaryButtonLink} variant="brand">
					{primaryButtonText}
				</Button>
				<Button href={primaryButtonLink}>
					{secondaryButtonText}
				</Button>
			</div>
		</div>
	</div>
</div>
