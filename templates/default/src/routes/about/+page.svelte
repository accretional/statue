<script>
	import { PageHero, Mission, Team, WhyChooseUs, CTA, PdfViewer } from 'statue-ssg';
</script>

<svelte:head>
	<title>About Your Site</title>
	<meta name="description" content="Learn about your Site, and how it was created." />
</svelte:head>

<div
	class="min-h-screen text-white bg-linear-to-b from-(--color-hero-from) via-(--color-hero-via] to-(--color-hero-to)"
>
	<PageHero
		title="About Your Statue Static Site"
		description="Customize your Statue about page at src/routes/about/+page.svelte"
	/>

	<div class="container mx-auto px-4 pb-32">
		<!-- Introduction -->
		<div class="text-center mb-16">
			<img src="/favicon.png" alt="Statue Logo" class="w-64 h-64 mx-auto mb-8" />
			<p class="text-lg mb-4">
				Statue is an <a
					href="https://github.com/accretional/statue"
					target="_blank"
					class="underline hover:text-blue-300 transition-colors">open source</a
				>
				static site generator brought to you by
				<a
					href="https://accretional.com"
					target="_blank"
					class="underline hover:text-blue-300 transition-colors">Accretional</a
				>, a developer tools company.
			</p>
			<p class="text-lg">Make this site yours with the components below!</p>
		</div>

		<Mission />
		<Team />
		<WhyChooseUs />

		<!-- PDF Viewer -->
		<section class="mb-16">
			<div class="max-w-4xl mx-auto">
				<PdfViewer src="/assets/example.pdf" height="1300px" />
			</div>
		</section>

		<CTA />
	</div>
</div>
