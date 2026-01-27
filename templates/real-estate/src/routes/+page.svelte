<script>
	import { onMount } from 'svelte';
	import {
		PropertyHero,
		PropertyOverview,
		PropertyStats,
		PropertyGallery,
		PropertyFeatures,
		PropertyLocation,
		PropertyContact,
		PropertyFooter
	} from '$lib/components';

	const { data } = $props();
	let property = $derived(data.property || {});

	// Intersection Observer for scroll animations
	let observer;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		// Observe all elements with animate-on-scroll class
		document.querySelectorAll('.animate-on-scroll').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Luxury Estate</title>
	<meta
		name="description"
		content="A rare international estate offering exceptional luxury living."
	/>
</svelte:head>

<div class="min-h-screen bg-[var(--color-background)]">
	<PropertyHero
		badge={property.badge}
		title={property.title}
		description={property.description}
		heroImage={property.heroImage}
		primaryCta={property.primaryCta}
		secondaryCta={property.secondaryCta}
	/>

	<PropertyOverview
		subtitle={property.overview?.subtitle}
		title={property.overview?.title}
		image={property.overview?.image}
		paragraphs={property.overview?.paragraphs}
	/>

	<PropertyStats stats={property.stats} />

	<PropertyGallery
		title={property.gallery?.title}
		subtitle={property.gallery?.subtitle}
		images={property.gallery?.images}
	/>

	<PropertyFeatures
		title={property.features?.title}
		subtitle={property.features?.subtitle}
		items={property.features?.items}
	/>

	<PropertyLocation
		title={property.location?.title}
		subtitle={property.location?.subtitle}
		image={property.location?.image}
		description={property.location?.description}
		highlights={property.location?.highlights}
	/>

	<PropertyContact
		title={property.contact?.title}
		subtitle={property.contact?.subtitle}
		description={property.contact?.description}
		email={property.contact?.email}
		phone={property.contact?.phone}
		address={property.contact?.address}
		social={property.contact?.social}
	/>

	<!-- Custom Footer for this template -->
	<footer class="py-16 px-4 border-t border-[var(--color-border)]">
		<div class="max-w-6xl mx-auto text-center">
			<p class="text-white text-2xl font-light tracking-wider mb-4">Luxury Estate</p>
			<p class="text-gray-500 text-sm mb-6">
				A rare international estate offering exceptional luxury living
			</p>
			<p class="text-gray-600 text-xs">
				© 2025 Luxury Estate. All rights reserved.
			</p>
		</div>
	</footer>
</div>

<style>
	:global(section) {
		position: relative;
	}
</style>
