<script lang="ts">
	export interface FeatureItem {
		title: string;
		description: string;
		icon?: string;
	}

	export interface RoomDetail {
		name: string;
		area?: string;
		dimensions?: string;
	}

	export interface PropertyPropertyParams {
		title?: string;
		subtitle?: string;
		features?: FeatureItem[];
		details?: {
			interior?: {
				bedrooms?: number;
				bathrooms?: number;
				fullBathrooms?: number;
				halfBathrooms?: number;
				rooms?: RoomDetail[];
				hasFireplace?: boolean;
				totalArea?: string;
				livableArea?: string;
			};
			parking?: {
				totalSpaces?: number;
				features?: string[];
			};
			lot?: {
				size?: string;
				parcelNumber?: string;
			};
			construction?: {
				homeType?: string;
				propertySubtype?: string;
				yearBuilt?: number;
				newConstruction?: boolean;
				condition?: string;
			};
			hoa?: {
				hasHoa?: boolean;
				fee?: string;
				frequency?: string;
			};
			financial?: {
				pricePerSqft?: string;
				taxAssessedValue?: string;
				annualTax?: string;
				daysOnMarket?: number;
				dateOnMarket?: string;
			};
		};
	}

	let {
		title = 'Property Details',
		subtitle = 'Features & Information',
		features = [],
		details
	}: PropertyPropertyParams = $props();

	let showSpecs = $state(false);

	function toggleSpecs() {
		showSpecs = !showSpecs;
	}
</script>

<section id="property" class="py-32 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<!-- Features Section -->
		{#if features.length > 0}
			<div class="mb-16">
				<h3 class="text-2xl font-light text-white text-center mb-12">Amenities</h3>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each features as item, index}
						<div class="animate-on-scroll animate-fade-up h-full" style:transition-delay="{index * 0.05}s;">
							<div
								class="border border-[var(--color-border)] p-6 hover:border-[var(--color-primary)] transition-colors duration-300 h-full flex flex-col"
							>
								<p class="text-[var(--color-primary)] text-xl mb-3">{item.icon || '✦'}</p>
								<h3 class="text-white text-base mb-2 tracking-wider uppercase">{item.title}</h3>
								<p class="text-gray-400 text-sm leading-relaxed flex-grow">{item.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Details Section - Collapsible -->
		{#if details}
			<div class="max-w-4xl mx-auto">
				<div class="animate-on-scroll animate-fade-up">
					<button
						onclick={toggleSpecs}
						class="cursor-pointer mx-auto flex items-center gap-3 text-white text-lg font-light hover:text-[var(--color-primary)] transition-colors"
					>
						<span>{showSpecs ? 'Hide' : 'View'} Full Specifications</span>
						<svg
							class="w-5 h-5 transition-transform duration-300"
							style:transform={showSpecs ? 'rotate(180deg)' : 'rotate(0)'}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if showSpecs}
						<div class="mt-12 animate-fade-in">
							<div class="grid md:grid-cols-2 gap-x-12 gap-y-8">
								<!-- Interior -->
								{#if details.interior}
									<div>
										<h4 class="text-white text-base font-medium mb-4">Interior</h4>
										<div class="space-y-2 text-sm">
											{#if details.interior.bedrooms !== undefined}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Beds</span>
													<span class="text-white">{details.interior.bedrooms}</span>
												</div>
											{/if}
											{#if details.interior.bathrooms !== undefined}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Baths</span>
													<span class="text-white">{details.interior.bathrooms}</span>
												</div>
											{/if}
											{#if details.interior.livableArea}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Living Area</span>
													<span class="text-white">{details.interior.livableArea}</span>
												</div>
											{/if}
											{#if details.interior.totalArea}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Total Area</span>
													<span class="text-white">{details.interior.totalArea}</span>
												</div>
											{/if}
											{#if details.interior.hasFireplace !== undefined}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Fireplace</span>
													<span class="text-white">{details.interior.hasFireplace ? 'Yes' : 'No'}</span>
												</div>
											{/if}
										</div>
									</div>
								{/if}

								<!-- Property -->
								{#if details.parking || details.lot}
									<div>
										<h4 class="text-white text-base font-medium mb-4">Property</h4>
										<div class="space-y-2 text-sm">
											{#if details.parking?.totalSpaces !== undefined}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Parking</span>
													<span class="text-white">{details.parking.totalSpaces} spaces</span>
												</div>
											{/if}
											{#if details.lot?.size}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Lot Size</span>
													<span class="text-white">{details.lot.size}</span>
												</div>
											{/if}
											{#if details.parking?.features && details.parking.features.length > 0}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Parking</span>
													<span class="text-white text-right text-xs">{details.parking.features.join(', ')}</span>
												</div>
											{/if}
										</div>
									</div>
								{/if}

								<!-- Construction -->
								{#if details.construction}
									<div>
										<h4 class="text-white text-base font-medium mb-4">Construction</h4>
										<div class="space-y-2 text-sm">
											{#if details.construction.yearBuilt}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Year Built</span>
													<span class="text-white">{details.construction.yearBuilt}</span>
												</div>
											{/if}
											{#if details.construction.homeType}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Type</span>
													<span class="text-white text-right text-xs">{details.construction.homeType}</span>
												</div>
											{/if}
											{#if details.construction.condition}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Condition</span>
													<span class="text-white">{details.construction.condition}</span>
												</div>
											{/if}
										</div>
									</div>
								{/if}

								<!-- Financial & HOA -->
								{#if details.financial || details.hoa?.hasHoa}
									<div>
										<h4 class="text-white text-base font-medium mb-4">Financial</h4>
										<div class="space-y-2 text-sm">
											{#if details.financial?.pricePerSqft}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Price/Sqft</span>
													<span class="text-white">{details.financial.pricePerSqft}</span>
												</div>
											{/if}
											{#if details.financial?.annualTax}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">Annual Tax</span>
													<span class="text-white">{details.financial.annualTax}</span>
												</div>
											{/if}
											{#if details.hoa?.hasHoa && details.hoa.fee}
												<div class="flex justify-between py-1 border-b border-[var(--color-border)]">
													<span class="text-gray-400">HOA</span>
													<span class="text-white">{details.hoa.fee}{details.hoa.frequency ? `/${details.hoa.frequency}` : ''}</span>
												</div>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>
