<script>
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

	// Quick links for footer
	let quickLinks = $derived([
		{ title: 'Home', url: '#hero' },
		{ title: 'About', url: '#about' },
		{ title: 'Services', url: '#services' },
		{ title: 'Markets', url: '#markets' },
		{ title: 'Listings', url: '#listings' },
		{ title: 'Contact', url: '#contact' }
	]);
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
	primaryCta={brokerage.primaryCta}
	secondaryCta={brokerage.secondaryCta}
/>

<BrokerageStats stats={brokerage.stats} />

<BrokerageAbout
	subtitle={brokerage.about?.subtitle}
	title={brokerage.about?.title}
	description={brokerage.about?.description}
	image={brokerage.about?.image}
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
	limit={brokerage.agents?.limit}
	showSeeAll={brokerage.agents?.showSeeAll}
	seeAllUrl={brokerage.agents?.seeAllUrl}
	agents={brokerage.agents?.items}
/>

<BrokerageListings
	subtitle={brokerage.listings?.subtitle}
	title={brokerage.listings?.title}
	description={brokerage.listings?.description}
	limit={brokerage.listings?.limit}
	showSeeAll={brokerage.listings?.showSeeAll}
	seeAllUrl={brokerage.listings?.seeAllUrl}
	listings={brokerage.listings?.items}
/>

<BrokerageTestimonials
	subtitle={brokerage.testimonials?.subtitle}
	title={brokerage.testimonials?.title}
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
/>

<BrokerageFooter
	brand={site.footer?.brand ?? brokerage.name}
	tagline={site.footer?.tagline ?? brokerage.tagline}
	copyrightText={site.footer?.copyrightText}
	license={brokerage.license}
	{quickLinks}
	social={brokerage.contact?.social}
/>
