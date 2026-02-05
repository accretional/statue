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
	<!-- Top gradient fade for navbar readability -->
	<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>
	<!-- Subtle scrim overlay: only darken bottom edge -->
	<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10"></div>
	<!-- Additional bottom fade to match background -->
	<div class="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent z-10"></div>
	<img src={heroImage} alt="Luxury Estate" class="absolute inset-0 w-full h-full object-cover" />
	<div class="relative z-20 text-center px-4 max-w-5xl -mt-20">
		<!-- Mobile: blur container, Desktop: no container -->
		<div class="md:contents">
			<div class="md:hidden rounded-2xl px-6 py-8 mb-4" style="background: rgba(0,0,0,0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);">
				<p class="text-[var(--color-primary)] text-sm tracking-[0.3em] uppercase mb-3 animate-on-scroll animate-fade-up">
					{badge}
				</p>
				<h1 class="text-4xl font-light text-white mb-4 leading-tight animate-on-scroll animate-fade-up" style="transition-delay: 0.1s;">
					{@html title}
				</h1>
				<p class="text-base text-gray-300 font-light leading-relaxed animate-on-scroll animate-fade-up" style="transition-delay: 0.2s;">
					{description}
				</p>
			</div>

			<!-- Desktop: text with shadow, no container -->
			<div class="hidden md:block">
				<p
					class="text-[var(--color-primary)] text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-on-scroll animate-fade-up"
					style="text-shadow: 0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6);"
				>
					{badge}
				</p>
				<h1
					class="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight animate-on-scroll animate-fade-up"
					style="transition-delay: 0.1s; text-shadow: 0 4px 12px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8);"
				>
					{@html title}
				</h1>
				<p
					class="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-on-scroll animate-fade-up"
					style="transition-delay: 0.2s; text-shadow: 0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6);"
				>
					{description}
				</p>
			</div>
		</div>
		<div class="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll animate-fade-up" style:transition-delay="0.3s;">
			{#if primaryCta}
				<a
					href={primaryCta.url}
					class="px-10 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium rounded-none tracking-wider hover:bg-[var(--color-secondary)] transition-all duration-300 text-sm uppercase"
				>
					{primaryCta.text}
				</a>
			{/if}
			{#if secondaryCta}
				<a
					href={secondaryCta.url}
					class="px-10 py-4 bg-transparent border border-white/30 text-white font-medium rounded-none tracking-wider hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 text-sm uppercase"
				>
					{secondaryCta.text}
				</a>
			{/if}
		</div>
	</div>
</section>
