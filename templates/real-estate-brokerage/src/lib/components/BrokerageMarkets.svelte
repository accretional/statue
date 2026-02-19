<script lang="ts">
	export interface BrokerageMarketsProps {
		subtitle?: string;
		title?: string;
		description?: string;
		markets?: Array<{
			name: string;
			description: string;
			image: string;
			stats?: string;
		}>;
	}

	let {
		subtitle = 'Our Markets',
		title = 'Premier Locations We Serve',
		description = 'Deep expertise across the most desirable real estate markets.',
		markets = [
			{
				name: 'San Francisco',
				description: 'Iconic city living with world-class amenities',
				image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800',
				stats: '450+ Active Listings'
			},
			{
				name: 'Palo Alto',
				description: 'Heart of Silicon Valley innovation',
				image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800',
				stats: '320+ Active Listings'
			},
			{
				name: 'Atherton',
				description: 'Exclusive estates and unmatched privacy',
				image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800',
				stats: '85+ Active Listings'
			},
			{
				name: 'Menlo Park',
				description: 'Tech hub with family-friendly neighborhoods',
				image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
				stats: '210+ Active Listings'
			}
		]
	}: BrokerageMarketsProps = $props();
</script>

<section id="markets" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each markets as market, index}
				<div
					class="group relative overflow-hidden animate-on-scroll animate-fade-up cursor-pointer"
					style="animation-delay: {index * 100}ms"
				>
					<div class="aspect-[3/4] overflow-hidden">
						<img
							src={market.image}
							alt={market.name}
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
						/>
					</div>
					<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-6">
						<h3 class="text-white text-xl font-light mb-1">{market.name}</h3>
						<p class="text-gray-400 text-sm mb-2">{market.description}</p>
						{#if market.stats}
							<p class="text-[var(--color-primary)] text-xs tracking-wide">{market.stats}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
