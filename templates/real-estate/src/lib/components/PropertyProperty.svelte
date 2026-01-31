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
</script>

<section id="property" class="py-32 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<!-- Features Section -->
		{#if features.length > 0}
			<div class="mb-24">
				<h3 class="text-2xl font-light text-white text-center mb-12">Amenities</h3>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each features as item, index}
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
			</div>
		{/if}

		<!-- Details Section -->
		{#if details}
			<div class="max-w-3xl mx-auto">
				<h3 class="text-2xl font-light text-white text-center mb-12">Specifications</h3>
				{#if details.interior}
					<div class="mb-12">
						<h3 class="text-white text-lg font-medium mb-1">Interior</h3>
						<div class="h-px bg-[var(--color-border)] mb-6"></div>

						{#if details.interior.bedrooms !== undefined || details.interior.bathrooms !== undefined}
							<div class="mb-8">
								<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Bedrooms & Bathrooms</h4>
								<div class="space-y-3">
									{#if details.interior.bedrooms !== undefined}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Bedrooms</span>
											<span class="text-white text-sm font-medium">{details.interior.bedrooms}</span>
										</div>
									{/if}
									{#if details.interior.bathrooms !== undefined}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Bathrooms</span>
											<span class="text-white text-sm font-medium">{details.interior.bathrooms}</span>
										</div>
									{/if}
									{#if details.interior.fullBathrooms !== undefined}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Full Bathrooms</span>
											<span class="text-white text-sm font-medium">{details.interior.fullBathrooms}</span>
										</div>
									{/if}
									{#if details.interior.halfBathrooms !== undefined}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Half Bathrooms</span>
											<span class="text-white text-sm font-medium">{details.interior.halfBathrooms}</span>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						{#if details.interior.rooms && details.interior.rooms.length > 0}
							<div class="mb-8">
								<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Rooms</h4>
								<div class="space-y-1">
									{#each details.interior.rooms as room}
										<div class="border-b border-[var(--color-border)]">
											<div class="py-2">
												<span class="text-white text-sm">{room.name}</span>
												<div class="flex gap-6 mt-1 text-xs text-gray-500">
													{#if room.dimensions}<span>{room.dimensions}</span>{/if}
													{#if room.area}<span>{room.area}</span>{/if}
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						{#if details.interior.totalArea || details.interior.livableArea}
							<div class="mb-8">
								<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Interior Area</h4>
								<div class="space-y-3">
									{#if details.interior.livableArea}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Total interior livable area</span>
											<span class="text-white text-sm font-medium">{details.interior.livableArea}</span>
										</div>
									{/if}
									{#if details.interior.totalArea}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Total structure area</span>
											<span class="text-white text-sm font-medium">{details.interior.totalArea}</span>
										</div>
									{/if}
									{#if details.interior.hasFireplace !== undefined}
										<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
											<span class="text-gray-400 text-sm">Fireplace</span>
											<span class="text-white text-sm font-medium">{details.interior.hasFireplace ? 'Yes' : 'No'}</span>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/if}

				{#if details.parking || details.lot}
					<div class="mb-12">
						<h3 class="text-white text-lg font-medium mb-1">Property</h3>
						<div class="h-px bg-[var(--color-border)] mb-6"></div>
						<div class="space-y-3">
							{#if details.parking?.totalSpaces !== undefined}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Parking Spaces</span>
									<span class="text-white text-sm font-medium">{details.parking.totalSpaces}</span>
								</div>
							{/if}
							{#if details.parking?.features && details.parking.features.length > 0}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Parking Features</span>
									<span class="text-white text-sm font-medium text-right">{details.parking.features.join(', ')}</span>
								</div>
							{/if}
							{#if details.lot?.size}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Lot Size</span>
									<span class="text-white text-sm font-medium">{details.lot.size}</span>
								</div>
							{/if}
							{#if details.lot?.parcelNumber}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Parcel Number</span>
									<span class="text-white text-sm font-medium">{details.lot.parcelNumber}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if details.construction}
					<div class="mb-12">
						<h3 class="text-white text-lg font-medium mb-1">Construction</h3>
						<div class="h-px bg-[var(--color-border)] mb-6"></div>
						<div class="space-y-3">
							{#if details.construction.homeType}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Home Type</span>
									<span class="text-white text-sm font-medium">{details.construction.homeType}</span>
								</div>
							{/if}
							{#if details.construction.propertySubtype}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Property Subtype</span>
									<span class="text-white text-sm font-medium">{details.construction.propertySubtype}</span>
								</div>
							{/if}
							{#if details.construction.yearBuilt}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Year Built</span>
									<span class="text-white text-sm font-medium">{details.construction.yearBuilt}</span>
								</div>
							{/if}
							{#if details.construction.condition}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Condition</span>
									<span class="text-white text-sm font-medium">{details.construction.condition}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if details.hoa?.hasHoa}
					<div class="mb-12">
						<h3 class="text-white text-lg font-medium mb-1">HOA</h3>
						<div class="h-px bg-[var(--color-border)] mb-6"></div>
						<div class="space-y-3">
							{#if details.hoa.fee}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">HOA Fee</span>
									<span class="text-white text-sm font-medium">{details.hoa.fee}{details.hoa.frequency ? ` ${details.hoa.frequency}` : ''}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if details.financial}
					<div class="mb-12">
						<h3 class="text-white text-lg font-medium mb-1">Financial</h3>
						<div class="h-px bg-[var(--color-border)] mb-6"></div>
						<div class="space-y-3">
							{#if details.financial.pricePerSqft}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Price per Square Foot</span>
									<span class="text-white text-sm font-medium">{details.financial.pricePerSqft}</span>
								</div>
							{/if}
							{#if details.financial.taxAssessedValue}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Tax Assessed Value</span>
									<span class="text-white text-sm font-medium">{details.financial.taxAssessedValue}</span>
								</div>
							{/if}
							{#if details.financial.annualTax}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Annual Tax</span>
									<span class="text-white text-sm font-medium">{details.financial.annualTax}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>
