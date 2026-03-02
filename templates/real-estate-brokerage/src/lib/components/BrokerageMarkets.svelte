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
		subtitle = '',
		title = '',
		description = '',
		markets = []
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
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
					></div>
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
