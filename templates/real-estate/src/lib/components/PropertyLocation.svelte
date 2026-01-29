<script lang="ts">
	export interface LocationHighlight {
		title: string;
		description: string;
	}

	export interface PropertyLocationProps {
		title?: string;
		subtitle?: string;
		image?: string;
		description?: string;
		highlights?: LocationHighlight[];
	}

	let {
		title = 'Prestigious Address',
		subtitle = 'Location',
		image = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2069',
		description = 'Nestled in one of San Francisco\'s most coveted neighborhoods.',
		highlights = []
	}: PropertyLocationProps = $props();
</script>

<section id="location" class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="grid md:grid-cols-2 gap-16 items-center">
			<div class="animate-on-scroll animate-fade-left">
				<img src={image} alt="San Francisco" class="w-full h-[500px] object-cover" />
			</div>
			<div class="animate-on-scroll animate-fade-right">
				<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
				<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
				<p class="text-gray-400 text-lg leading-relaxed mb-8">{description}</p>
				<div class="space-y-4">
					{#each highlights as highlight}
						<div class="flex items-start gap-4">
							<p class="text-[var(--color-primary)] mt-1">◆</p>
							<div>
								<p class="text-white font-medium mb-1">{highlight.title}</p>
								<p class="text-gray-400 text-sm">{highlight.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
