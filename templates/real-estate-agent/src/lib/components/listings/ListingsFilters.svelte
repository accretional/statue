<script lang="ts">
	let {
		selectedStatus,
		selectedTypes,
		priceRange,
		bedRooms,
		bathRooms,
		sortBy,
		allTypes,
		searchQuery,
		onSearch
	}: {
		selectedStatus: string[];
		selectedTypes: string[];
		priceRange: [number, number];
		bedRooms: number;
		bathRooms: number;
		sortBy: 'newest' | 'price-low' | 'price-high' | 'sqft';
		allTypes: string[];
		searchQuery: string;
		onSearch: (e: Event) => void;
	} = $props();

	const statusOptions = [
		{ value: 'active', label: 'Active' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'sold', label: 'Sold' }
	];

	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'price-low', label: 'Price: Low to High' },
		{ value: 'price-high', label: 'Price: High to Low' },
		{ value: 'sqft', label: 'Square Feet' }
	];

	function formatPrice(price: number): string {
		if (price >= 1000000) {
			return `$${(price / 1000000).toFixed(1)}M`;
		}
		return `$${(price / 1000).toFixed(0)}K`;
	}

	function toggleStatus(value: string) {
		if (selectedStatus.includes(value)) {
			selectedStatus = selectedStatus.filter((v) => v !== value);
		} else {
			selectedStatus = [...selectedStatus, value];
		}
	}

	function toggleType(value: string) {
		if (selectedTypes.includes(value)) {
			selectedTypes = selectedTypes.filter((v) => v !== value);
		} else {
			selectedTypes = [...selectedTypes, value];
		}
	}
</script>

<div class="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 sticky top-4">
	<h2 class="text-white text-lg font-light mb-6">Filters</h2>

	<!-- Search -->
	<div class="mb-6">
		<label class="block text-gray-400 text-sm mb-2">Search</label>
		<input
			type="text"
			placeholder="Address, city, keywords..."
			bind:value={searchQuery}
			oninput={onSearch}
			class="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)]"
		/>
	</div>

	<!-- Status Filter -->
	<div class="mb-6">
		<label class="block text-gray-400 text-sm mb-2">Status</label>
		<div class="space-y-2">
			{#each statusOptions as option}
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={selectedStatus.includes(option.value)}
						onchange={() => toggleStatus(option.value)}
						class="w-4 h-4 accent-[var(--color-primary)]"
					/>
					<span class="text-gray-300">{option.label}</span>
				</label>
			{/each}
		</div>
	</div>

	<!-- Property Type Filter -->
	{#if allTypes.length > 0}
		<div class="mb-6">
			<label class="block text-gray-400 text-sm mb-2">Property Type</label>
			<div class="space-y-2">
				{#each allTypes as type}
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={selectedTypes.includes(type)}
							onchange={() => toggleType(type)}
							class="w-4 h-4 accent-[var(--color-primary)]"
						/>
						<span class="text-gray-300">{type}</span>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Price Range -->
	<div class="mb-6">
		<label class="block text-gray-400 text-sm mb-2">
			Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
		</label>
		<div class="space-y-3">
			<input
				type="range"
				min="0"
				max="10000000"
				step="100000"
				bind:value={priceRange[0]}
				class="w-full accent-[var(--color-primary)]"
			/>
			<input
				type="range"
				min="0"
				max="10000000"
				step="100000"
				bind:value={priceRange[1]}
				class="w-full accent-[var(--color-primary)]"
			/>
		</div>
		<div class="flex justify-between text-xs text-gray-500 mt-1">
			<span>$0</span>
			<span>$10M+</span>
		</div>
	</div>

	<!-- Bedrooms -->
	<div class="mb-6">
		<label class="block text-gray-400 text-sm mb-2">Bedrooms</label>
		<div class="flex gap-2">
			{#each [0, 1, 2, 3, 4, 5] as n}
				<button
					onclick={() => (bedRooms = n)}
					class="flex-1 py-2 text-sm border rounded {bedRooms === n
						? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
						: 'border-[var(--color-border)] text-gray-300 hover:border-[var(--color-primary)]'} transition-colors"
				>
					{n === 0 ? 'Any' : n + '+'}
				</button>
			{/each}
		</div>
	</div>

	<!-- Bathrooms -->
	<div class="mb-6">
		<label class="block text-gray-400 text-sm mb-2">Bathrooms</label>
		<div class="flex gap-2">
			{#each [0, 1, 2, 3, 4] as n}
				<button
					onclick={() => (bathRooms = n)}
					class="flex-1 py-2 text-sm border rounded {bathRooms === n
						? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
						: 'border-[var(--color-border)] text-gray-300 hover:border-[var(--color-primary)]'} transition-colors"
				>
					{n === 0 ? 'Any' : n + '+'}
				</button>
			{/each}
		</div>
	</div>

	<!-- Sort By -->
	<div>
		<label class="block text-gray-400 text-sm mb-2">Sort By</label>
		<select
			bind:value={sortBy}
			class="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white focus:outline-none focus:border-[var(--color-primary)]"
		>
			{#each sortOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
</div>
