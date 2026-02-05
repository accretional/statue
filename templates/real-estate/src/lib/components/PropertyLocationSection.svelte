<script lang="ts">
	export interface LocationHighlight {
		title: string;
		description: string;
	}

	export interface PropertyLocationSectionProps {
		title?: string;
		subtitle?: string;
		image?: string;
		description?: string;
		highlights?: LocationHighlight[];
		mapEnabled?: boolean;
		mapTitle?: string;
		mapDescription?: string;
		latitude?: number;
		longitude?: number;
		zoom?: number;
	}

	let {
		title,
		subtitle,
		image,
		description,
		highlights,
		mapEnabled,
		mapTitle,
		mapDescription,
		latitude,
		longitude,
		zoom
	}: PropertyLocationSectionProps = $props();

	// OpenStreetMap iframe URL
	let mapUrl = $derived(
		`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
	);

	// Link to open full map
	let fullMapUrl = $derived(
		`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`
	);
</script>

<section id="location" class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Location Description & Highlights -->
		<div class="grid md:grid-cols-2 gap-16 items-center mb-32">
			<div class="animate-on-scroll animate-fade-left">
				<img src={image} alt={title} class="w-full h-[500px] object-cover" />
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

		<!-- Map Section -->
		{#if mapEnabled}
			<div class="max-w-6xl mx-auto">
				<div class="text-center mb-16 animate-on-scroll animate-fade-up">
					<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">
						Map
					</p>
					<h3 class="text-3xl md:text-4xl font-light text-white mb-6">{mapTitle}</h3>
					<p class="text-gray-400 text-lg">{mapDescription}</p>
				</div>

				<div class="animate-on-scroll animate-fade-up" style:transition-delay="0.1s">
					<div class="relative w-full h-[500px] border border-[var(--color-border)] overflow-hidden">
						<iframe
							title="Property Location Map"
							src={mapUrl}
							class="w-full h-full"
							frameborder="0"
							scrolling="no"
							marginheight="0"
							marginwidth="0"
						></iframe>

						<!-- Overlay link to open full map -->
						<a
							href={fullMapUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="absolute bottom-4 right-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2 text-xs tracking-wider uppercase hover:bg-[var(--color-secondary)] transition-all duration-300"
						>
							View Larger Map
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>
