<script lang="ts">
	export interface PropertyMapProps {
		title?: string;
		subtitle?: string;
		description?: string;
		latitude?: number;
		longitude?: number;
		zoom?: number;
		markerLabel?: string;
	}

	let {
		title = 'Find Us',
		subtitle = 'Location',
		description = 'Visit our exclusive property location.',
		latitude = 37.7749,
		longitude = -122.4194,
		zoom = 15,
		markerLabel = 'Property Location'
	}: PropertyMapProps = $props();

	// OpenStreetMap iframe URL (no API key needed!)
	let mapUrl = $derived(
		`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
	);

	// Link to open full map
	let fullMapUrl = $derived(
		`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`
	);
</script>

<section id="map" class="py-32 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">
				{subtitle}
			</p>
			<h2 class="text-4xl md:text-5xl font-light text-white mb-6">{title}</h2>
			<p class="text-gray-400 text-lg">{description}</p>
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
</section>
