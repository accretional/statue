<script lang="ts">
	export interface FeatureItem {
		title: string;
		description: string;
		icon?: string;
	}

	export interface PropertyFeaturesProps {
		title?: string;
		subtitle?: string;
		items?: FeatureItem[];
	}

	let {
		title = 'Exceptional Amenities',
		subtitle = 'Features',
		items = []
	}: PropertyFeaturesProps = $props();
</script>

<section id="features" class="py-32 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>
		{#if items.length === 0}
			<div class="text-center text-gray-500 py-16">
				<p class="text-lg">No features available</p>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each items as item, index}
					<div class="animate-on-scroll animate-fade-up h-full" style:transition-delay="{index * 0.1}s;">
						<div
							class="border border-[var(--color-border)] p-8 hover:border-[var(--color-primary)] transition-colors duration-300 h-full flex flex-col"
						>
							<p class="text-[var(--color-primary)] text-2xl mb-4">{item.icon || '✦'}</p>
							<h3 class="text-white text-lg mb-3 tracking-wider uppercase">{item.title}</h3>
							<p class="text-gray-400 text-sm leading-relaxed flex-grow">{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
