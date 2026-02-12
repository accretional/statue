<script lang="ts">
	export interface StatItem {
		value: string;
		label: string;
	}

	export interface PropertyStatsProps {
		stats?: StatItem[];
	}

	let {
		stats = [
			{ value: '8,500', label: 'Square Feet' },
			{ value: '5', label: 'Bedrooms' },
			{ value: '6.5', label: 'Bathrooms' },
			{ value: '3', label: 'Car Garage' }
		]
	}: PropertyStatsProps = $props();
</script>

<section class="py-20 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		{#if stats.length === 0}
			<div class="text-center text-gray-500 py-8">
				<p class="text-sm">No stats available</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
				{#each stats as stat, index}
					<div class="text-center animate-on-scroll animate-scale" style:transition-delay="{index * 0.1}s;">
						<p class="text-4xl md:text-5xl font-light text-[var(--color-primary)] mb-2">{stat.value}</p>
						<p class="text-gray-400 text-xs tracking-wider uppercase">{stat.label}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
