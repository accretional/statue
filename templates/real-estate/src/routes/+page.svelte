<script>
	import { onMount } from 'svelte';
	import PropertyHero from '$lib/components/PropertyHero.svelte';
	import PropertyOverview from '$lib/components/PropertyOverview.svelte';
	import PropertyHighlights from '$lib/components/PropertyHighlights.svelte';
	import PropertyAvailableSpaces from '$lib/components/PropertyAvailableSpaces.svelte';
	import PropertyStats from '$lib/components/PropertyStats.svelte';
	import PropertyGallery from '$lib/components/PropertyGallery.svelte';
	import PropertyProperty from '$lib/components/PropertyProperty.svelte';
	import PropertyLocationSection from '$lib/components/PropertyLocationSection.svelte';
	import PropertyNearby from '$lib/components/PropertyNearby.svelte';
	import PropertyBrochure from '$lib/components/PropertyBrochure.svelte';
	import PropertyRentCalculator from '$lib/components/PropertyRentCalculator.svelte';
	import PropertyLeaseTimeline from '$lib/components/PropertyLeaseTimeline.svelte';
	import PropertyContactSection from '$lib/components/PropertyContactSection.svelte';

	const { data } = $props();
	let site = $derived(data.site || {});
	let seo = $derived(data.seo || {});
	let footer = $derived(data.footer || {});
	let property = $derived(data.property || {});
	const year = new Date().getFullYear();
	let mobilePreviewAddress = $derived.by(() => {
		const address = property.contact?.address;
		if (!address) return 'Address available on full listing';
		return [address.street, address.city, address.state, address.zipCode]
			.filter(Boolean)
			.join(', ');
	});
	let mobilePreviewPrice = $derived(
		property.details?.financial?.taxAssessedValue ||
			property.details?.financial?.pricePerSqft ||
			'Contact for price'
	);
	let mobilePreviewBeds = $derived(property.details?.interior?.bedrooms);
	let mobilePreviewBaths = $derived(property.details?.interior?.bathrooms);
	let mobilePreviewSqft = $derived(property.details?.interior?.livableArea);
	let mobilePreviewType = $derived(property.details?.construction?.homeType || 'Property');

	// Template type: 'single' (residential) or 'multi' (commercial/office)
	let templateType = $derived(property.type || 'single');

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

	{#if templateType === 'multi'}
		<!-- Multi-unit: Highlights + Available Spaces -->
		<PropertyHighlights
			subtitle={property.highlights?.subtitle}
			title={property.highlights?.title}
			highlights={property.highlights?.items}
		/>

		<PropertyAvailableSpaces
			subtitle={property.availableSpaces?.subtitle}
			title={property.availableSpaces?.title}
			spaces={property.availableSpaces?.spaces}
			showCapacity={property.availableSpaces?.showCapacity}
		/>
	{:else}
		<!-- Single-unit: Overview + Stats -->
		<PropertyOverview
			subtitle={property.overview?.subtitle}
			title={property.overview?.title}
			image={property.overview?.image}
			paragraphs={property.overview?.paragraphs}
		/>

		<PropertyStats stats={property.stats} />
	{/if}

	<PropertyGallery
		title={property.gallery?.title}
		subtitle={property.gallery?.subtitle}
		images={property.gallery?.images}
		floorPlanEnabled={property.floorPlan?.enabled}
		floorPlanLevels={property.floorPlan?.levels}
		variant={templateType === 'multi' ? 'carousel' : 'grid'}
	/>

	<PropertyProperty
		title={property.features?.title || property.details?.title || 'Property Details'}
		subtitle={property.features?.subtitle ||
			property.details?.subtitle ||
			'Features & Information'}
		features={property.features?.items || []}
		details={property.details}
	/>

	{#if templateType === 'multi' && property.brochure?.enabled}
		<PropertyBrochure
			subtitle={property.brochure?.subtitle}
			title={property.brochure?.title}
			description={property.brochure?.description}
			pdfUrl={property.brochure?.pdfUrl}
			downloadText={property.brochure?.downloadText}
			showDownload={property.brochure?.showDownload}
			height={property.brochure?.height}
		/>
	{/if}

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

	{#if templateType === 'multi' && property.nearby}
		<PropertyNearby
			subtitle={property.nearby?.subtitle}
			title={property.nearby?.title}
			transportationEnabled={property.nearby?.transportationEnabled}
			transportationTitle={property.nearby?.transportationTitle}
			transportation={property.nearby?.transportation}
			amenitiesEnabled={property.nearby?.amenitiesEnabled}
			amenitiesTitle={property.nearby?.amenitiesTitle}
			amenities={property.nearby?.amenities}
		/>
	{/if}

	{#if templateType === 'multi' && property.rentCalculator?.enabled}
		<PropertyRentCalculator
			subtitle={property.rentCalculator?.subtitle}
			title={property.rentCalculator?.title}
			description={property.rentCalculator?.description}
			baseRentPerSf={property.rentCalculator?.baseRentPerSf}
			totalSf={property.rentCalculator?.totalSf}
			defaultTerm={property.rentCalculator?.defaultTerm}
			defaultFreeRent={property.rentCalculator?.defaultFreeRent}
			defaultTi={property.rentCalculator?.defaultTi}
			defaultEscalation={property.rentCalculator?.defaultEscalation}
		/>
	{/if}

	{#if templateType === 'multi' && property.leaseTimeline?.enabled}
		<PropertyLeaseTimeline
			subtitle={property.leaseTimeline?.subtitle}
			title={property.leaseTimeline?.title}
			description={property.leaseTimeline?.description}
			steps={property.leaseTimeline?.steps}
		/>
	{/if}

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

	<section id="listing-preview-list-card" class="list-preview-card">
		<div class="list-preview-content">
			<div class="relative overflow-hidden bg-black">
				<img
					src={property.heroImage}
					alt={property.title || 'Property preview'}
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
				<div class="list-preview-meta space-y-2 px-4 py-3 md:space-y-3 md:px-6 md:py-5">
					<div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
						<div class="min-w-0">
							<h2 class="text-xl md:text-3xl font-light text-white line-clamp-1">
								{property.title || site.name}
							</h2>
							<p class="mt-1 text-xs sm:text-sm text-gray-400 line-clamp-2">{mobilePreviewAddress}</p>
						</div>
						<p class="shrink-0 text-lg sm:text-2xl md:text-3xl font-light text-[var(--color-primary)] line-clamp-1">
							{mobilePreviewPrice}
						</p>
					</div>
					<div class="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-300">
						{#if mobilePreviewBeds}
							<span>✦ {mobilePreviewBeds} bd</span>
						{/if}
					{#if mobilePreviewBaths}
						<span>✦ {mobilePreviewBaths} ba</span>
					{/if}
					{#if mobilePreviewSqft}
						<span>✦ {mobilePreviewSqft}</span>
					{/if}
						<span>{mobilePreviewType}</span>
					</div>
					{#if property.description}
						<p class="hidden sm:block text-sm text-gray-300/90 line-clamp-2">{property.description}</p>
					{/if}
				</div>
			</div>
		</section>

	<section id="listing-preview-mobile-card" class="mobile-preview-card md:hidden">
		<div class="mobile-preview-backdrop" aria-hidden="true"></div>
		<div
			class="mobile-preview-content max-w-md mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-card)] shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
		>
			<div class="relative aspect-[4/3] overflow-hidden bg-black">
				<img
					src={property.heroImage}
					alt={property.title || 'Property preview'}
					class="absolute inset-0 h-full w-full object-cover"
				/>
				<div class="absolute top-3 left-3">
					<span class="rounded-md bg-black/45 px-2 py-1 text-xs text-white">{mobilePreviewType}</span>
				</div>
				<div class="absolute top-3 right-3">
					<span class="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
						ACTIVE
					</span>
				</div>
			</div>
			<div class="space-y-3 p-5">
				<h2 class="text-3xl font-light text-white">{property.title || site.name}</h2>
				<p class="text-sm text-gray-400">{mobilePreviewAddress}</p>
				<p class="text-3xl font-light text-[var(--color-primary)]">{mobilePreviewPrice}</p>
				<div class="flex flex-wrap gap-3 text-sm text-gray-300">
					{#if mobilePreviewBeds}
						<span>✦ {mobilePreviewBeds} bd</span>
					{/if}
					{#if mobilePreviewBaths}
						<span>✦ {mobilePreviewBaths} ba</span>
					{/if}
					{#if mobilePreviewSqft}
						<span>✦ {mobilePreviewSqft}</span>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Custom Footer for this template -->
	<footer class="py-16 px-4 border-t border-[var(--color-border)]">
		<div class="max-w-6xl mx-auto text-center">
			<p class="text-white text-2xl font-light tracking-wider mb-4">
				{footer.brand ?? site.name}
			</p>
			<p class="text-gray-500 text-sm mb-6">{footer.tagline ?? site.description}</p>
			<p class="text-gray-600 text-xs">
				© {year}
				{footer.brand ?? site.name}. {footer.copyrightText}
			</p>
		</div>
	</footer>
</div>

<style>
	:global(section) {
		position: relative;
	}

	.mobile-preview-card {
		position: fixed;
		top: 0;
		left: 0.75rem;
		right: 0.75rem;
		bottom: 0.75rem;
		z-index: 220;
		display: none;
		pointer-events: none;
	}

	.mobile-preview-card > div {
		pointer-events: auto;
	}

	.mobile-preview-backdrop {
		position: fixed;
		inset: 0;
		background: #000;
		opacity: 1;
		z-index: 0;
		pointer-events: none;
	}

	.mobile-preview-content {
		position: relative;
		z-index: 1;
	}

	.mobile-preview-card:target {
		display: block;
	}

	.list-preview-card {
		position: fixed;
		inset: 0;
		z-index: 220;
		display: none;
		pointer-events: none;
		background: #000;
	}

	.list-preview-content {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: minmax(220px, 38%) 1fr;
		border: 0;
		border-radius: 0;
		background: var(--color-card);
		overflow: hidden;
		box-shadow: none;
		pointer-events: none;
	}

	.list-preview-content > :first-child {
		height: 100%;
	}

	.list-preview-meta {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.list-preview-card:target {
		display: block;
	}

	@media (max-width: 780px) {
		.list-preview-content {
			grid-template-columns: minmax(160px, 42%) 1fr;
		}

		.list-preview-meta {
			padding: 0.75rem 0.9rem;
			gap: 0.4rem;
		}
	}

	@media (max-width: 480px) {
		.list-preview-content {
			grid-template-columns: minmax(120px, 44%) 1fr;
		}
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
