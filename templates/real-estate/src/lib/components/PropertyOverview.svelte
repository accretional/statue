<script lang="ts">
	export interface PropertyOverviewProps {
		subtitle?: string;
		title?: string;
		image?: string;
		paragraphs?: string[];
	}

	let {
		subtitle = 'Property Overview',
		title = 'Timeless Elegance in the Heart of the City',
		image = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
		paragraphs = [
			'This extraordinary residence represents the pinnacle of luxury living. Meticulously crafted with the finest materials and attention to detail.',
			'Featuring soaring ceilings, expansive windows, and seamless indoor-outdoor living spaces.'
		]
	}: PropertyOverviewProps = $props();
</script>

<section class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="grid md:grid-cols-2 gap-16 items-center">
			<div class="animate-on-scroll animate-fade-left">
				<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
				<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
				{#each paragraphs as paragraph}
					<p class="text-gray-400 text-lg leading-relaxed mb-8">{paragraph}</p>
				{/each}
			</div>
			<div class="animate-on-scroll animate-fade-right">
				<img src={image} alt="Property Interior" class="w-full h-[600px] object-cover" />
			</div>
		</div>
	</div>
</section>
