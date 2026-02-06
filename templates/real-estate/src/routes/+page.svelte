<script>
	import { onMount } from 'svelte';
	import {
		PropertyHero,
		PropertyOverview,
		PropertyStats,
		PropertyGallery,
		PropertyProperty,
		PropertyLocationSection,
		PropertyContactSection
	} from '$lib/components';

	const { data } = $props();
	let site = $derived(data.site || {});
	let seo = $derived(data.seo || {});
	let footer = $derived(data.footer || {});
	let property = $derived(data.property || {});
	const year = new Date().getFullYear();

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
	<title>{seo.defaultTitle ?? site.name}</title>
	<meta name="description" content={seo.defaultDescription ?? site.description} />
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
		floorPlanEnabled={property.floorPlan?.enabled}
		floorPlanLevels={property.floorPlan?.levels}
	/>

	<PropertyProperty
		title={property.features?.title || property.details?.title || 'Property Details'}
		subtitle={property.features?.subtitle || property.details?.subtitle || 'Features & Information'}
		features={property.features?.items || []}
		details={property.details}
	/>

	<PropertyLocationSection
		title={property.location?.title}
		subtitle={property.location?.subtitle}
		image={property.location?.image}
		description={property.location?.description}
		highlights={property.location?.highlights}
		mapEnabled={property.map?.enabled}
		mapTitle={property.map?.title}
		mapDescription={property.map?.description}
		latitude={property.contact?.address?.latitude ?? 37.7749}
		longitude={property.contact?.address?.longitude ?? -122.4194}
		zoom={property.map?.zoom ?? 15}
	/>

	<PropertyContactSection
		subtitle={property.contact?.subtitle || 'Get In Touch'}
		title={property.contact?.title || 'Contact & Schedule'}
		agentName={property.agent?.name}
		agentTitle={property.agent?.role}
		agentImage={property.agent?.image}
		agentBio={property.agent?.bio}
		agentPhone={property.agent?.phone}
		agentEmail={property.agent?.email}
		specialties={property.agent?.specialties}
		agentSocial={property.agent?.social}
		openHouseEnabled={property.openHouse?.enabled}
		openHouseTitle={property.openHouse?.title}
		events={property.openHouse?.events}
		location={property.openHouse?.location}
		eventDescription={property.openHouse?.description}
		calendlyUrl={property.openHouse?.calendlyUrl}
		email={property.contact?.email}
		phone={property.contact?.phone}
		address={property.contact?.address}
		social={property.contact?.social}
	/>

	<!-- Custom Footer for this template -->
	<footer class="py-16 px-4 border-t border-[var(--color-border)]">
		<div class="max-w-6xl mx-auto text-center">
			<p class="text-white text-2xl font-light tracking-wider mb-4">
				{footer.brand ?? site.name}
			</p>
			<p class="text-gray-500 text-sm mb-6">{footer.tagline ?? site.description}</p>
			<p class="text-gray-600 text-xs">
				© {year} {footer.brand ?? site.name}. {footer.copyrightText}
			</p>
		</div>
	</footer>
</div>

<style>
	:global(section) {
		position: relative;
	}
</style>
