<script lang="ts">
	export interface AgentHeroProps {
		name?: string;
		title?: string;
		tagline?: string;
		image?: string;
		phone?: string;
		email?: string;
		primaryCta?: {
			text: string;
			url: string;
		};
		secondaryCta?: {
			text: string;
			url: string;
		};
	}

	let {
		name = 'Sarah Mitchell',
		title = 'Licensed Real Estate Agent',
		tagline = 'Helping you find your perfect home in the Bay Area',
		image = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
		phone = '+1 (555) 123-4567',
		email = 'sarah@example.com',
		primaryCta = { text: 'Schedule Consultation', url: '#contact' },
		secondaryCta = { text: 'View Listings', url: '#listings' }
	}: AgentHeroProps = $props();
</script>

<section id="hero" class="relative min-h-screen flex items-center">
	<!-- Background with overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-card)] to-[var(--color-background)]"></div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 py-24 w-full">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<!-- Text Content -->
			<div class="animate-on-scroll animate-fade-right">
				<p class="text-[var(--color-primary)] text-sm tracking-[0.25em] uppercase mb-4">Welcome</p>
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
					{name}
				</h1>
				<p class="text-xl text-[var(--color-primary)] font-light mb-6">{title}</p>
				<p class="text-gray-400 text-lg mb-8 max-w-lg">{tagline}</p>

				<!-- Contact Info -->
				<div class="flex flex-wrap gap-6 mb-8">
					<a href="tel:{phone}" class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
						</svg>
						<span>{phone}</span>
					</a>
					<a href="mailto:{email}" class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
							<polyline points="22,6 12,13 2,6"></polyline>
						</svg>
						<span>{email}</span>
					</a>
				</div>

				<!-- CTAs -->
				<div class="flex flex-wrap gap-4">
					{#if primaryCta}
						<a
							href={primaryCta.url}
							class="cursor-pointer px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
						>
							{primaryCta.text}
						</a>
					{/if}
					{#if secondaryCta}
						<a
							href={secondaryCta.url}
							class="cursor-pointer px-8 py-4 border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 text-sm tracking-wider uppercase"
						>
							{secondaryCta.text}
						</a>
					{/if}
				</div>
			</div>

			<!-- Agent Image -->
			<div class="animate-on-scroll animate-fade-left">
				<div class="relative">
					<div class="absolute inset-0 bg-[var(--color-primary)]/20 transform translate-x-4 translate-y-4"></div>
					<img
						src={image}
						alt={name}
						class="relative z-10 w-full max-w-md mx-auto aspect-[3/4] object-cover"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
