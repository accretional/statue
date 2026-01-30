<script lang="ts">
	export interface RoomDetail {
		name: string;
		area?: string;
		dimensions?: string;
	}

	export interface PropertyDetailsProps {
		subtitle?: string;
		title?: string;
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
	}

	let {
		subtitle = 'Property Information',
		title = 'Facts & Features',
		interior,
		parking,
		lot,
		construction,
		hoa,
		financial
	}: PropertyDetailsProps = $props();
</script>

<section id="details" class="py-32 px-4">
	<div class="max-w-3xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
			<div class="w-24 h-px bg-[var(--color-border)] mx-auto mt-6"></div>
		</div>

		<div class="animate-on-scroll animate-fade-up">
			<!-- Interior -->
			{#if interior}
				<div class="mb-12">
					<h3 class="text-white text-lg font-medium mb-1">Interior</h3>
					<div class="h-px bg-[var(--color-border)] mb-6"></div>

					<!-- Bedrooms & Bathrooms -->
					<div class="mb-8">
						<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Bedrooms & Bathrooms</h4>
						<div class="space-y-3">
							{#if interior.bedrooms !== undefined}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Bedrooms</span>
									<span class="text-white text-sm font-medium">{interior.bedrooms}</span>
								</div>
							{/if}
							{#if interior.bathrooms !== undefined}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Bathrooms</span>
									<span class="text-white text-sm font-medium">{interior.bathrooms}</span>
								</div>
							{/if}
							{#if interior.fullBathrooms !== undefined}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Full Bathrooms</span>
									<span class="text-white text-sm font-medium">{interior.fullBathrooms}</span>
								</div>
							{/if}
							{#if interior.halfBathrooms !== undefined}
								<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
									<span class="text-gray-400 text-sm">Half Bathrooms</span>
									<span class="text-white text-sm font-medium">{interior.halfBathrooms}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Room Details -->
					{#if interior.rooms && interior.rooms.length > 0}
						<div class="mb-8">
							<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Rooms</h4>
							<div class="space-y-1">
								{#each interior.rooms as room}
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

					<!-- Interior Area -->
					{#if interior.totalArea || interior.livableArea}
						<div class="mb-8">
							<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Interior Area</h4>
							<div class="space-y-3">
								{#if interior.livableArea}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Total interior livable area</span>
										<span class="text-white text-sm font-medium">{interior.livableArea}</span>
									</div>
								{/if}
								{#if interior.totalArea}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Total structure area</span>
										<span class="text-white text-sm font-medium">{interior.totalArea}</span>
									</div>
								{/if}
								{#if interior.hasFireplace !== undefined}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Fireplace</span>
										<span class="text-white text-sm font-medium">{interior.hasFireplace ? 'Yes' : 'No'}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Property -->
			{#if parking || lot}
				<div class="mb-12">
					<h3 class="text-white text-lg font-medium mb-1">Property</h3>
					<div class="h-px bg-[var(--color-border)] mb-6"></div>

					<!-- Parking -->
					{#if parking}
						<div class="mb-8">
							<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Parking</h4>
							<div class="space-y-3">
								{#if parking.totalSpaces !== undefined}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Total Spaces</span>
										<span class="text-white text-sm font-medium">{parking.totalSpaces}</span>
									</div>
								{/if}
								{#if parking.features && parking.features.length > 0}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Features</span>
										<span class="text-white text-sm font-medium">{parking.features.join(', ')}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Lot -->
					{#if lot}
						<div class="mb-8">
							<h4 class="text-[var(--color-primary)] text-sm uppercase tracking-wider mb-4">Lot</h4>
							<div class="space-y-3">
								{#if lot.size}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Size</span>
										<span class="text-white text-sm font-medium">{lot.size}</span>
									</div>
								{/if}
								{#if lot.parcelNumber}
									<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
										<span class="text-gray-400 text-sm">Parcel Number</span>
										<span class="text-white text-sm font-medium">{lot.parcelNumber}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Construction -->
			{#if construction}
				<div class="mb-12">
					<h3 class="text-white text-lg font-medium mb-1">Construction</h3>
					<div class="h-px bg-[var(--color-border)] mb-6"></div>

					<div class="space-y-3">
						{#if construction.homeType}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Home Type</span>
								<span class="text-white text-sm font-medium">{construction.homeType}</span>
							</div>
						{/if}
						{#if construction.propertySubtype}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Property Subtype</span>
								<span class="text-white text-sm font-medium">{construction.propertySubtype}</span>
							</div>
						{/if}
						{#if construction.yearBuilt}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Year Built</span>
								<span class="text-white text-sm font-medium">{construction.yearBuilt}</span>
							</div>
						{/if}
						{#if construction.condition}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Condition</span>
								<span class="text-white text-sm font-medium">{construction.condition}</span>
							</div>
						{/if}
						{#if construction.newConstruction !== undefined}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">New Construction</span>
								<span class="text-white text-sm font-medium">{construction.newConstruction ? 'Yes' : 'No'}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- HOA -->
			{#if hoa && hoa.hasHoa}
				<div class="mb-12">
					<h3 class="text-white text-lg font-medium mb-1">HOA</h3>
					<div class="h-px bg-[var(--color-border)] mb-6"></div>

					<div class="space-y-3">
						{#if hoa.fee}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">HOA Fee</span>
								<span class="text-white text-sm font-medium">{hoa.fee}{hoa.frequency ? ` ${hoa.frequency}` : ''}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Financial -->
			{#if financial}
				<div class="mb-12">
					<h3 class="text-white text-lg font-medium mb-1">Financial & Listing Details</h3>
					<div class="h-px bg-[var(--color-border)] mb-6"></div>

					<div class="space-y-3">
						{#if financial.pricePerSqft}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Price per Square Foot</span>
								<span class="text-white text-sm font-medium">{financial.pricePerSqft}</span>
							</div>
						{/if}
						{#if financial.taxAssessedValue}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Tax Assessed Value</span>
								<span class="text-white text-sm font-medium">{financial.taxAssessedValue}</span>
							</div>
						{/if}
						{#if financial.annualTax}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Annual Tax</span>
								<span class="text-white text-sm font-medium">{financial.annualTax}</span>
							</div>
						{/if}
						{#if financial.dateOnMarket}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Date on Market</span>
								<span class="text-white text-sm font-medium">{financial.dateOnMarket}</span>
							</div>
						{/if}
						{#if financial.daysOnMarket !== undefined}
							<div class="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
								<span class="text-gray-400 text-sm">Days on Market</span>
								<span class="text-white text-sm font-medium">{financial.daysOnMarket} days</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
