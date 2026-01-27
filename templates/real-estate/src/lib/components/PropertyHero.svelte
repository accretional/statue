<script lang="ts">
	export interface HeroCta {
		text: string;
		url: string;
	}

	export interface PropertyHeroProps {
		badge?: string;
		title?: string;
		description?: string;
		heroImage?: string;
		primaryCta?: HeroCta;
		secondaryCta?: HeroCta;
	}

	let {
		badge = 'A Rare International Estate Offering',
		title = 'Exceptional Living',
		description = 'Experience unparalleled luxury in this architectural masterpiece.',
		heroImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
		primaryCta = { text: 'Inquire Now', url: '#contact' },
		secondaryCta = { text: 'View Gallery', url: '#gallery' }
	}: PropertyHeroProps = $props();
</script>

<section class="relative h-screen flex items-center justify-center overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--color-background)] z-10"></div>
	<img src={heroImage} alt="Luxury Estate" class="absolute inset-0 w-full h-full object-cover" />
	<div class="relative z-20 text-center px-4 max-w-5xl">
		<p
			class="text-[var(--color-primary)] text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-on-scroll animate-fade-up"
		>
			{badge}
		</p>
		<h1
			class="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight animate-on-scroll animate-fade-up"
			style="transition-delay: 0.1s;"
		>
			{@html title}
		</h1>
		<p
			class="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-on-scroll animate-fade-up"
			style="transition-delay: 0.2s;"
		>
			{description}
		</p>
		<div class="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll animate-fade-up" style:transition-delay="0.3s;">
			<a
				href={primaryCta.url}
				class="px-10 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium rounded-none tracking-wider hover:bg-[var(--color-secondary)] transition-all duration-300 text-sm uppercase"
			>
				{primaryCta.text}
			</a>
			<a
				href={secondaryCta.url}
				class="px-10 py-4 bg-transparent border border-white/30 text-white font-medium rounded-none tracking-wider hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 text-sm uppercase"
			>
				{secondaryCta.text}
			</a>
		</div>
	</div>
</section>
