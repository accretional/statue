<script lang="ts">
	export interface TransportOption {
		name: string;
		type: 'rail' | 'bus' | 'airport' | 'highway';
		distance: string;
		duration: string;
	}

	export interface NearbyPlace {
		name: string;
		category: string;
		priceLevel?: string;
		distance: string;
	}

	export interface NearbyCategory {
		name: string;
		icon: string;
		places: NearbyPlace[];
	}

	export interface PropertyNearbyProps {
		subtitle?: string;
		title?: string;
		transportationEnabled?: boolean;
		transportationTitle?: string;
		transportation?: TransportOption[];
		amenitiesEnabled?: boolean;
		amenitiesTitle?: string;
		amenities?: NearbyCategory[];
	}

	let {
		subtitle = 'Neighborhood',
		title = 'Nearby',
		transportationEnabled = true,
		transportationTitle = 'Transportation',
		transportation = [
			{ name: 'Route 59 Station', type: 'rail', distance: '13 min drive', duration: '6.0 mi' },
			{ name: 'Naperville Station', type: 'rail', distance: '17 min drive', duration: '8.5 mi' },
			{ name: 'Aurora Station', type: 'rail', distance: '18 min drive', duration: '9.8 mi' },
			{ name: 'Chicago Midway International', type: 'airport', distance: '45 min drive', duration: '30.4 mi' },
			{ name: "Chicago O'Hare International", type: 'airport', distance: '54 min drive', duration: '36.0 mi' }
		],
		amenitiesEnabled = true,
		amenitiesTitle = 'Nearby Amenities',
		amenities = [
			{
				name: 'Restaurants',
				icon: 'restaurant',
				places: [
					{ name: "Jet's Pizza", category: 'Fast Food', priceLevel: '$', distance: '3 min walk' },
					{ name: 'Wild Tuna Contemporary Sushi', category: 'Sushi', priceLevel: '$$$', distance: '3 min walk' },
					{ name: "Portillo's", category: 'American', priceLevel: '$$', distance: '5 min walk' }
				]
			},
			{
				name: 'Retail',
				icon: 'retail',
				places: [
					{ name: 'State Farm', category: 'Insurance', distance: 'In Building' },
					{ name: 'LA Fitness', category: 'Fitness', distance: '7 min walk' },
					{ name: 'Amazon Fresh', category: 'Supermarket', distance: '7 min walk' }
				]
			}
		]
	}: PropertyNearbyProps = $props();

	function getTransportIcon(type: string) {
		switch (type) {
			case 'rail':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8m-8 4h8m-5 4h2" />`;
			case 'bus':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 17h8M8 17v2m8-2v2M6 13h12M6 13V7a2 2 0 012-2h8a2 2 0 012 2v6M6 13v2a2 2 0 002 2h8a2 2 0 002-2v-2" />`;
			case 'airport':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />`;
			case 'highway':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />`;
			default:
				return `<circle cx="12" cy="12" r="10" stroke-width="1.5" />`;
		}
	}

	function getAmenityIcon(icon: string) {
		switch (icon) {
			case 'restaurant':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />`;
			case 'retail':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />`;
			default:
				return `<circle cx="12" cy="12" r="3" stroke-width="1.5" />`;
		}
	}

	function getTypeColor(type: string) {
		// Use CSS variable for theme color, fallback to type-specific colors
		return 'bg-[var(--color-primary)]';
	}
</script>

<section id="nearby" class="py-24 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-16">
			<!-- Transportation -->
			{#if transportationEnabled && transportation.length > 0}
				<div class="animate-on-scroll animate-fade-left">
					<h3 class="text-2xl font-light text-white mb-8">{transportationTitle}</h3>
					<div class="space-y-1">
						{#each transportation as option}
							<div class="flex items-center justify-between py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors px-2 -mx-2">
								<div class="flex items-center gap-4">
									<span class="w-2 h-2 rounded-full {getTypeColor(option.type)}"></span>
									<span class="text-gray-300">{option.name}</span>
								</div>
								<div class="flex items-center gap-6 text-sm">
									<span class="text-gray-400">{option.distance}</span>
									<span class="text-gray-500 w-20 text-right">{option.duration}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Nearby Amenities -->
			{#if amenitiesEnabled && amenities.length > 0}
				<div class="animate-on-scroll animate-fade-right">
					<h3 class="text-2xl font-light text-white mb-8">{amenitiesTitle}</h3>
					<div class="space-y-8">
						{#each amenities as category}
							<div>
								<h4 class="text-[var(--color-primary)] text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{@html getAmenityIcon(category.icon)}
									</svg>
									{category.name}
								</h4>
								<div class="space-y-1">
									{#each category.places as place}
										<div class="flex items-center justify-between py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors px-2 -mx-2">
											<div>
												<span class="text-gray-300">{place.name}</span>
												<span class="text-gray-500 text-sm ml-2">{place.category}</span>
												{#if place.priceLevel}
													<span class="text-[var(--color-primary)] text-sm ml-2">{place.priceLevel}</span>
												{/if}
											</div>
											<span class="text-gray-500 text-sm">{place.distance}</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
