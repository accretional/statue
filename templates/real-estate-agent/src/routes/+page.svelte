<script>
	import { onMount } from 'svelte';
	import { Mail, Phone } from 'lucide-svelte';
	import siteConfig from '../../site.config.json';
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
	let site = $derived(data.site || siteConfig.site || {});
	let agent = $derived(data.agent || siteConfig.agent || {});
	let isEmbedded = $state(false);
	let previewName = $derived(agent.name || site.name || 'Real Estate Agent');
	let previewTitle = $derived(agent.title || agent.tagline || '');
	let previewImage = $derived(agent.image || '');
	let previewDescription = $derived(agent.about?.bio || agent.tagline || site.description || '');
	let previewPhone = $derived(agent.phone || '');
	let previewEmail = $derived(agent.email || '');
	let previewSpecialties = $derived.by(() => {
		if (Array.isArray(agent.specialties)) {
			return agent.specialties.filter(Boolean).slice(0, 3);
		}

		if (Array.isArray(agent.about?.specialties)) {
			return agent.about.specialties
				.map((item) => (typeof item === 'string' ? item : item?.title))
				.filter(Boolean)
				.slice(0, 3);
		}

		return [];
	});

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
		try {
			isEmbedded = window.self !== window.top;
		} catch {
			isEmbedded = true;
		}

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
	subtitle={agent.listings?.featured?.subtitle}
	title={agent.listings?.featured?.title}
	description={agent.listings?.featured?.description}
	limit={agent.listings?.featured?.limit}
	status={agent.listings?.featured?.status}
	listings={agent.listings?.items}
/>

<AgentSold
	subtitle={agent.listings?.sold?.subtitle}
	title={agent.listings?.sold?.title}
	description={agent.listings?.sold?.description}
	limit={agent.listings?.sold?.limit}
	listings={agent.listings?.items}
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
	{quickLinks}
/>

<section id="agent-preview-mobile-card" class="agent-preview-card" class:embedded={isEmbedded}>
	<div class="agent-preview-backdrop" aria-hidden="true"></div>
	<div
		class="agent-preview-content max-w-md mx-auto overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
	>
		<div class="agent-preview-shell">
			<div class="agent-preview-media relative overflow-hidden bg-black">
				{#if previewImage}
					<img
						src={previewImage}
						alt={previewName}
						class="absolute inset-0 h-full w-full object-cover"
					/>
				{:else}
					<div class="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950"></div>
				{/if}
			</div>
			<div class="p-6">
				<h3 class="text-white text-xl font-light mb-1">{previewName}</h3>
				{#if previewTitle}
					<p class="text-[var(--color-primary)] text-sm mb-3">{previewTitle}</p>
				{/if}
				{#if previewSpecialties.length > 0}
					<div class="flex flex-wrap gap-2 mb-4">
						{#each previewSpecialties as specialty}
							<span class="text-xs text-gray-400 px-2 py-1 border border-[var(--color-border)]">
								{specialty}
							</span>
						{/each}
					</div>
				{/if}
				<div class="flex flex-col gap-2 text-sm">
					{#if previewEmail}
						<span class="inline-flex items-center gap-2 text-gray-400 break-all">
							<Mail size={14} strokeWidth={1.75} />
							<span>{previewEmail}</span>
						</span>
					{/if}
					{#if previewPhone}
						<span class="inline-flex items-center gap-2 text-gray-400">
							<Phone size={14} strokeWidth={1.75} />
							<span>{previewPhone}</span>
						</span>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<section id="agent-preview-list-card" class="agent-list-preview-card">
	<div class="agent-list-preview-content">
		<div class="relative overflow-hidden bg-black">
			{#if previewImage}
				<img
					src={previewImage}
					alt={previewName}
					class="absolute inset-0 h-full w-full object-cover"
				/>
			{:else}
				<div class="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950"></div>
			{/if}
		</div>
		<div class="agent-list-preview-meta space-y-2 px-4 py-3 md:space-y-3 md:px-6 md:py-5">
			<div class="min-w-0">
				<h2 class="text-xl md:text-3xl font-light text-white line-clamp-1">{previewName}</h2>
				{#if previewTitle}
					<p
						class="mt-1 text-xs sm:text-sm uppercase tracking-[0.14em] text-[var(--color-primary)] line-clamp-1"
					>
						{previewTitle}
					</p>
				{/if}
			</div>
			{#if previewDescription}
				<p class="text-sm text-gray-300/90 line-clamp-2">{previewDescription}</p>
			{/if}
			<div class="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-300">
				{#if previewEmail}
					<span class="line-clamp-1">{previewEmail}</span>
				{/if}
				{#if previewPhone}
					<span>{previewPhone}</span>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.agent-preview-card {
		position: fixed;
		inset: 0;
		padding: 0.75rem;
		z-index: 220;
		display: none;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.agent-preview-card > div {
		pointer-events: auto;
	}

	.agent-preview-backdrop {
		position: fixed;
		inset: 0;
		background: #000;
		opacity: 1;
		z-index: 0;
		pointer-events: none;
	}

	.agent-preview-content {
		position: relative;
		z-index: 1;
		width: min(100%, 25rem);
		height: min(100%, 44rem);
	}

	.agent-preview-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.agent-preview-media {
		position: relative;
		flex: 1 1 auto;
		min-height: 0;
	}

	.agent-preview-card:target {
		display: flex;
	}

	.agent-preview-card.embedded {
		padding: 0;
	}

	.agent-preview-card.embedded .agent-preview-backdrop {
		display: none;
	}

	.agent-preview-card.embedded .agent-preview-content {
		width: 100%;
		height: 100%;
		max-width: none;
		border: 0;
		box-shadow: none;
	}

	.agent-list-preview-card {
		position: fixed;
		inset: 0;
		z-index: 220;
		display: none;
		pointer-events: none;
		background: #000;
	}

	.agent-list-preview-content {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: minmax(220px, 38%) 1fr;
		background: #090909;
	}

	.agent-list-preview-content > :first-child {
		position: relative;
		min-height: 100%;
	}

	.agent-list-preview-content > :first-child::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 55%, rgba(0, 0, 0, 0.62));
	}

	.agent-list-preview-meta {
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.agent-list-preview-card:target {
		display: block;
	}

	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.agent-list-preview-content {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(180px, 45%) 1fr;
		}

		.agent-list-preview-content > :first-child::after {
			background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.55));
		}
	}
</style>
