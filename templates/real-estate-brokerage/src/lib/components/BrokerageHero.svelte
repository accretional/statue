<script lang="ts">
	export interface BrokerageHeroProps {
		name?: string;
		tagline?: string;
		description?: string;
		heroImage?: string;
		eyebrow?: string;
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
		name = '',
		tagline = '',
		description = '',
		heroImage = '',
		eyebrow = '',
		primaryCta = undefined,
		secondaryCta = undefined
	}: BrokerageHeroProps = $props();
</script>

<section id="hero" class="relative min-h-screen flex items-center">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0">
		<img src={heroImage} alt={name} class="absolute inset-0 w-full h-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 py-24 w-full">
		<div class="max-w-3xl animate-on-scroll animate-fade-right">
			{#if eyebrow}
				<p class="text-[var(--color-primary)] text-sm tracking-[0.25em] uppercase mb-6">
					{eyebrow}
				</p>
			{/if}
			<h1 class="text-4xl md:text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
				{name}
			</h1>
			<p class="text-xl md:text-2xl text-[var(--color-primary)] font-light mb-6">{tagline}</p>
			<p class="text-gray-400 text-lg mb-10 max-w-2xl leading-relaxed">{description}</p>

			<!-- CTAs -->
			<div class="flex flex-wrap gap-4">
				{#if primaryCta}
					<a
						href={primaryCta.url}
						class="cursor-pointer px-10 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
					>
						{primaryCta.text}
					</a>
				{/if}
				{#if secondaryCta}
					<a
						href={secondaryCta.url}
						class="cursor-pointer px-10 py-4 border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 text-sm tracking-wider uppercase"
					>
						{secondaryCta.text}
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="text-white/50"
		>
			<path d="M12 5v14M19 12l-7 7-7-7"></path>
		</svg>
	</div>
</section>
