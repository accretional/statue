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
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<div class="space-y-12 animate-on-scroll animate-fade-up">
			<!-- Interior -->
			{#if interior}
				<div class="border-t border-[var(--color-border)] pt-8">
					<h3 class="text-white text-xl font-light mb-6">Interior</h3>

					<!-- Bedrooms & Bathrooms -->
					<div class="mb-6">
						<h4 class="text-gray-400 text-sm mb-4">Bedrooms & bathrooms</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
							{#if interior.bedrooms !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">Bedrooms</span>
									<span class="text-white">{interior.bedrooms}</span>
								</div>
							{/if}
							{#if interior.bathrooms !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">Bathrooms</span>
									<span class="text-white">{interior.bathrooms}</span>
								</div>
							{/if}
							{#if interior.fullBathrooms !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">Full bathrooms</span>
									<span class="text-white">{interior.fullBathrooms}</span>
								</div>
							{/if}
							{#if interior.halfBathrooms !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">Half bathrooms</span>
									<span class="text-white">{interior.halfBathrooms}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Room Details -->
					{#if interior.rooms && interior.rooms.length > 0}
						<div class="mb-6 space-y-4">
							{#each interior.rooms as room}
								<div>
									<h5 class="text-white text-sm mb-2">{room.name}</h5>
									<div class="grid grid-cols-2 gap-x-8 text-sm">
										{#if room.area}
											<div class="flex justify-between">
												<span class="text-gray-400">Area</span>
												<span class="text-gray-300">{room.area}</span>
											</div>
										{/if}
										{#if room.dimensions}
											<div class="flex justify-between">
												<span class="text-gray-400">Dimensions</span>
												<span class="text-gray-300">{room.dimensions}</span>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Features -->
					<div>
						<h4 class="text-gray-400 text-sm mb-4">Features</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
							{#if interior.hasFireplace !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">Has fireplace</span>
									<span class="text-white">{interior.hasFireplace ? 'Yes' : 'No'}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Interior Area -->
					{#if interior.totalArea || interior.livableArea}
						<div class="mt-6">
							<h4 class="text-gray-400 text-sm mb-4">Interior area</h4>
							<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
								{#if interior.totalArea}
									<div class="flex justify-between">
										<span class="text-gray-400">Total structure area</span>
										<span class="text-white">{interior.totalArea}</span>
									</div>
								{/if}
								{#if interior.livableArea}
									<div class="flex justify-between">
										<span class="text-gray-400">Total interior livable area</span>
										<span class="text-white">{interior.livableArea}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Property -->
			{#if parking || lot}
				<div class="border-t border-[var(--color-border)] pt-8">
					<h3 class="text-white text-xl font-light mb-6">Property</h3>

					<!-- Parking -->
					{#if parking}
						<div class="mb-6">
							<h4 class="text-gray-400 text-sm mb-4">Parking</h4>
							<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
								{#if parking.totalSpaces !== undefined}
									<div class="flex justify-between">
										<span class="text-gray-400">Total spaces</span>
										<span class="text-white">{parking.totalSpaces}</span>
									</div>
								{/if}
								{#if parking.features && parking.features.length > 0}
									<div class="flex justify-between col-span-2">
										<span class="text-gray-400">Parking features</span>
										<span class="text-white text-right">{parking.features.join(', ')}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Lot -->
					{#if lot}
						<div>
							<h4 class="text-gray-400 text-sm mb-4">Lot</h4>
							<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
								{#if lot.size}
									<div class="flex justify-between">
										<span class="text-gray-400">Size</span>
										<span class="text-white">{lot.size}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Details -->
					{#if lot?.parcelNumber}
						<div class="mt-6">
							<h4 class="text-gray-400 text-sm mb-4">Details</h4>
							<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-400">Parcel number</span>
									<span class="text-white">{lot.parcelNumber}</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Construction -->
			{#if construction}
				<div class="border-t border-[var(--color-border)] pt-8">
					<h3 class="text-white text-xl font-light mb-6">Construction</h3>

					<!-- Type & Style -->
					<div class="mb-6">
						<h4 class="text-gray-400 text-sm mb-4">Type & style</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
							{#if construction.homeType}
								<div class="flex justify-between">
									<span class="text-gray-400">Home type</span>
									<span class="text-white">{construction.homeType}</span>
								</div>
							{/if}
							{#if construction.propertySubtype}
								<div class="flex justify-between">
									<span class="text-gray-400">Property subtype</span>
									<span class="text-white">{construction.propertySubtype}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Condition -->
					<div>
						<h4 class="text-gray-400 text-sm mb-4">Condition</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
							{#if construction.condition}
								<div class="flex justify-between col-span-2">
									<span class="text-gray-400">{construction.condition}</span>
								</div>
							{/if}
							{#if construction.newConstruction !== undefined}
								<div class="flex justify-between">
									<span class="text-gray-400">New construction</span>
									<span class="text-white">{construction.newConstruction ? 'Yes' : 'No'}</span>
								</div>
							{/if}
							{#if construction.yearBuilt}
								<div class="flex justify-between">
									<span class="text-gray-400">Year built</span>
									<span class="text-white">{construction.yearBuilt}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Community & HOA -->
			{#if hoa && hoa.hasHoa}
				<div class="border-t border-[var(--color-border)] pt-8">
					<h3 class="text-white text-xl font-light mb-6">Community & HOA</h3>

					<div>
						<h4 class="text-gray-400 text-sm mb-4">HOA</h4>
						<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-400">Has HOA</span>
								<span class="text-white">Yes</span>
							</div>
							{#if hoa.fee}
								<div class="flex justify-between">
									<span class="text-gray-400">HOA fee</span>
									<span class="text-white">{hoa.fee} {hoa.frequency || ''}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Financial & Listing Details -->
			{#if financial}
				<div class="border-t border-[var(--color-border)] pt-8">
					<h3 class="text-white text-xl font-light mb-6">Financial & listing details</h3>

					<div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
						{#if financial.pricePerSqft}
							<div class="flex justify-between">
								<span class="text-gray-400">Price per square foot</span>
								<span class="text-white">{financial.pricePerSqft}</span>
							</div>
						{/if}
						{#if financial.taxAssessedValue}
							<div class="flex justify-between">
								<span class="text-gray-400">Tax assessed value</span>
								<span class="text-white">{financial.taxAssessedValue}</span>
							</div>
						{/if}
						{#if financial.annualTax}
							<div class="flex justify-between">
								<span class="text-gray-400">Annual tax amount</span>
								<span class="text-white">{financial.annualTax}</span>
							</div>
						{/if}
						{#if financial.dateOnMarket}
							<div class="flex justify-between">
								<span class="text-gray-400">Date on market</span>
								<span class="text-white">{financial.dateOnMarket}</span>
								</div>
						{/if}
						{#if financial.daysOnMarket !== undefined}
							<div class="flex justify-between">
								<span class="text-gray-400">Cumulative days on market</span>
								<span class="text-white">{financial.daysOnMarket} days</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
