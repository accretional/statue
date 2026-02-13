<script>
	import { onMount } from 'svelte';
	import {
		AgentHero,
		AgentAbout,
		AgentListings,
		AgentSold,
		AgentServices,
		AgentTestimonials,
		AgentContact,
		AgentFooter
	} from '$lib/components';

	const { data } = $props();
	let site = $derived(data.site || {});
	let agent = $derived(data.agent || {});

	// Quick links for footer
	let quickLinks = $derived([
		{ title: 'Home', url: '#hero' },
		{ title: 'About', url: '#about' },
		{ title: 'Listings', url: '#listings' },
		{ title: 'Services', url: '#services' },
		{ title: 'Contact', url: '#contact' }
	]);

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

<AgentHero
	name={agent.name}
	title={agent.title}
	tagline={agent.tagline}
	image={agent.image}
	phone={agent.phone}
	email={agent.email}
	primaryCta={agent.primaryCta}
	secondaryCta={agent.secondaryCta}
/>

<AgentAbout
	subtitle={agent.about?.subtitle}
	title={agent.about?.title}
	bio={agent.about?.bio}
	stats={agent.about?.stats}
	specialties={agent.about?.specialties}
/>

<AgentListings
	subtitle={agent.listings?.subtitle}
	title={agent.listings?.title}
	description={agent.listings?.description}
	listings={agent.listings?.properties}
/>

<AgentSold
	subtitle={agent.sold?.subtitle}
	title={agent.sold?.title}
	description={agent.sold?.description}
	soldListings={agent.sold?.properties}
/>

<AgentServices
	subtitle={agent.services?.subtitle}
	title={agent.services?.title}
	description={agent.services?.description}
	services={agent.services?.items}
/>

<AgentTestimonials
	subtitle={agent.testimonials?.subtitle}
	title={agent.testimonials?.title}
	testimonials={agent.testimonials?.items}
/>

<AgentContact
	subtitle={agent.contact?.subtitle}
	title={agent.contact?.title}
	description={agent.contact?.description}
	name={agent.name}
	phone={agent.phone}
	email={agent.email}
	address={agent.contact?.address}
	social={agent.contact?.social}
	calendlyUrl={agent.contact?.calendlyUrl}
/>

<AgentFooter
	brand={site.footer?.brand}
	tagline={site.footer?.tagline}
	copyrightText={site.footer?.copyrightText}
	agentName={agent.name}
	license={agent.license}
	social={agent.contact?.social}
	quickLinks={quickLinks}
/>
