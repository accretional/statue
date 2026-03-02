<script>
	import { onMount } from 'svelte';
	import {
		BrokerageHero,
		BrokerageStats,
		BrokerageAbout,
		BrokerageServices,
		BrokerageMarkets,
		BrokerageAgents,
		BrokerageListings,
		BrokerageTestimonials,
		BrokerageContact,
		BrokerageFooter
	} from '$lib/components';

	const { data } = $props();
	let site = $derived(data.site || {});
	let seo = $derived(data.seo || {});
	let brokerage = $derived(data.brokerage || {});
	let navbarConfig = $derived(data.navbarConfig || {});

	let quickLinks = $derived(
		site.footer?.quickLinks?.length ? site.footer.quickLinks : (navbarConfig.defaultNavItems ?? [])
	);
	let legalLinks = $derived(site.footer?.legalLinks ?? []);

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

		document.querySelectorAll('.animate-on-scroll').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{seo.title ?? site.name}</title>
	<meta name="description" content={seo.description ?? site.description} />
</svelte:head>

<BrokerageHero
	name={brokerage.name}
	tagline={brokerage.tagline}
	description={brokerage.description}
	heroImage={brokerage.heroImage}
	eyebrow={brokerage.heroEyebrow}
	primaryCta={brokerage.primaryCta}
	secondaryCta={brokerage.secondaryCta}
/>

<BrokerageStats stats={brokerage.stats} />

<BrokerageAbout
	subtitle={brokerage.about?.subtitle}
	title={brokerage.about?.title}
	description={brokerage.about?.description}
	image={brokerage.about?.image}
	imageAlt={brokerage.about?.imageAlt}
	highlights={brokerage.about?.highlights}
/>

<BrokerageServices
	subtitle={brokerage.services?.subtitle}
	title={brokerage.services?.title}
	description={brokerage.services?.description}
	services={brokerage.services?.items}
/>

<BrokerageMarkets
	subtitle={brokerage.markets?.subtitle}
	title={brokerage.markets?.title}
	description={brokerage.markets?.description}
	markets={brokerage.markets?.items}
/>

<BrokerageAgents
	subtitle={brokerage.agents?.subtitle}
	title={brokerage.agents?.title}
	description={brokerage.agents?.description}
	limit={brokerage.agents?.items?.length ?? 0}
	showSeeAll={false}
	seeAllUrl={brokerage.agents?.seeAllUrl}
	viewAllText={brokerage.agents?.viewAllText}
	emptyStateText={brokerage.agents?.emptyStateText}
	remotePreviewFragment={brokerage.agents?.remotePreviewFragment}
	agents={brokerage.agents?.items}
/>

<BrokerageListings
	subtitle={brokerage.listings?.subtitle}
	title={brokerage.listings?.title}
	description={brokerage.listings?.description}
	limit={brokerage.listings?.items?.length ?? 0}
	showSeeAll={false}
	seeAllUrl={brokerage.listings?.seeAllUrl}
	viewAllText={brokerage.listings?.viewAllText}
	emptyStateText={brokerage.listings?.emptyStateText}
	fallbackTitle={brokerage.listings?.fallbackTitle}
	fallbackPriceText={brokerage.listings?.fallbackPriceText}
	bedroomLabel={brokerage.listings?.bedroomLabel}
	bathroomLabel={brokerage.listings?.bathroomLabel}
	sqftLabel={brokerage.listings?.sqftLabel}
	listings={brokerage.listings?.items}
/>

<BrokerageTestimonials
	subtitle={brokerage.testimonials?.subtitle}
	title={brokerage.testimonials?.title}
	agentLabelPrefix={brokerage.testimonials?.agentLabelPrefix}
	emptyStateText={brokerage.testimonials?.emptyStateText}
	testimonials={brokerage.testimonials?.items}
/>

<BrokerageContact
	subtitle={brokerage.contact?.subtitle}
	title={brokerage.contact?.title}
	description={brokerage.contact?.description}
	phone={brokerage.contact?.phone}
	email={brokerage.contact?.email}
	address={brokerage.contact?.address}
	hours={brokerage.contact?.hours}
	social={brokerage.contact?.social}
	contactHeading={brokerage.contact?.contactHeading}
	hoursHeading={brokerage.contact?.hoursHeading}
	socialHeading={brokerage.contact?.socialHeading}
	messageButtonText={brokerage.contact?.messageButtonText}
/>

<BrokerageFooter
	brand={site.footer?.brand ?? brokerage.name}
	tagline={site.footer?.tagline ?? brokerage.tagline}
	copyrightText={site.footer?.copyrightText}
	license={brokerage.license}
	quickLinksTitle={site.footer?.quickLinksTitle}
	{quickLinks}
	{legalLinks}
	legalTitle={site.footer?.legalTitle}
	equalHousingText={site.footer?.equalHousingText}
	social={brokerage.contact?.social}
/>
