<script lang="ts">
	export interface FloorPlanLevel {
		title: string;
		image: string;
		description?: string;
	}

	export interface PropertyFloorPlanProps {
		subtitle?: string;
		title?: string;
		levels?: FloorPlanLevel[];
	}

	let {
		subtitle = 'Explore the Layout',
		title = 'Floor Plan',
		levels = []
	}: PropertyFloorPlanProps = $props();
</script>

<section id="floor-plan" class="py-32 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		{#if levels.length === 0}
			<div class="text-center text-gray-500 py-16">
				<p class="text-lg">No floor plan available</p>
			</div>
		{:else}
			<div class="grid md:grid-cols-1 gap-12">
				{#each levels as level, index}
					<div class="animate-on-scroll animate-fade-up" style:transition-delay="{index * 0.15}s;">
						{#if level.title}
							<h3 class="text-white text-xl font-light mb-4 text-center">{level.title}</h3>
						{/if}
						<div class="border border-[var(--color-border)] p-4 bg-[var(--color-card)]">
							<img
								src={level.image}
								alt={level.title || 'Floor Plan'}
								class="w-full h-auto"
							/>
							{#if level.description}
								<p class="text-gray-400 text-sm mt-4 text-center">{level.description}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
