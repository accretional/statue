<script lang="ts">
	export interface AvailableSpace {
		name: string;
		floor?: string;
		capacity?: string;
		size: string;
		sizeUnit?: string;
		rentalRate: string;
		rateUnit?: string;
		spaceUse: string;
		available?: boolean;
	}

	export interface PropertyAvailableSpacesProps {
		subtitle?: string;
		title?: string;
		spaces?: AvailableSpace[];
		showCapacity?: boolean;
	}

	let {
		subtitle = 'Available Now',
		title = 'All Available Spaces',
		spaces = [
			{ name: 'Ste 117', floor: '1st Floor', capacity: '-', size: '1,133', sizeUnit: 'SF', rentalRate: '$4,600', rateUnit: '/MO', spaceUse: 'Office', available: true },
			{ name: 'Ste 118', floor: '1st Floor', capacity: '-', size: '205', sizeUnit: 'SF', rentalRate: '$1,200', rateUnit: '/MO', spaceUse: 'Office', available: true },
			{ name: 'Ste 06', floor: '1st Floor', capacity: '4', size: '545', sizeUnit: 'SF', rentalRate: '$2,075', rateUnit: '/MO', spaceUse: 'Office', available: true },
			{ name: 'Ste 106', floor: '1st Floor', capacity: '-', size: '389', sizeUnit: 'SF', rentalRate: '$1,285', rateUnit: '/MO', spaceUse: 'Office', available: true },
			{ name: 'Ste 07', floor: '1st Floor', capacity: '-', size: '240', sizeUnit: 'SF', rentalRate: '$2,400', rateUnit: '/MO', spaceUse: 'Office/Medical', available: true }
		],
		showCapacity = true
	}: PropertyAvailableSpacesProps = $props();

	let expandedIndex = $state<number | null>(null);

	function toggleExpand(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}
</script>

<section id="spaces" class="py-24 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="mb-12 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white">{title} ({spaces.length})</h2>
		</div>

		<!-- Desktop Table -->
		<div class="hidden md:block animate-on-scroll animate-fade-up overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[var(--color-border)] text-left">
						<th class="pb-4 text-gray-400 text-sm font-normal tracking-wider uppercase">Space</th>
						{#if showCapacity}
							<th class="pb-4 text-gray-400 text-sm font-normal tracking-wider uppercase">Capacity</th>
						{/if}
						<th class="pb-4 text-gray-400 text-sm font-normal tracking-wider uppercase">Size</th>
						<th class="pb-4 text-gray-400 text-sm font-normal tracking-wider uppercase">Rental Rate</th>
						<th class="pb-4 text-gray-400 text-sm font-normal tracking-wider uppercase">Space Use</th>
						<th class="pb-4"></th>
					</tr>
				</thead>
				<tbody>
					{#each spaces as space, i}
						<tr
							class="border-b border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors cursor-pointer"
							onclick={() => toggleExpand(i)}
						>
							<td class="py-6">
								<div class="flex items-center gap-3">
									{#if space.available}
										<span class="w-2 h-2 rounded-full bg-green-500"></span>
									{/if}
									<div>
										<p class="text-white font-medium">{space.floor}, {space.name}</p>
									</div>
								</div>
							</td>
							{#if showCapacity}
								<td class="py-6 text-gray-300">
									{#if space.capacity && space.capacity !== '-'}
										<span class="flex items-center gap-2">
											<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											{space.capacity}
										</span>
									{:else}
										<span class="text-gray-500">-</span>
									{/if}
								</td>
							{/if}
							<td class="py-6 text-gray-300">
								{space.size} <span class="text-gray-500">{space.sizeUnit || 'SF'}</span>
							</td>
							<td class="py-6">
								<span class="text-white font-medium">{space.rentalRate}</span>
								<span class="text-gray-500">{space.rateUnit || '/MO'}</span>
							</td>
							<td class="py-6">
								<span class="px-3 py-1 bg-[var(--color-card)] border border-[var(--color-border)] text-gray-300 text-sm">
									{space.spaceUse}
								</span>
							</td>
							<td class="py-6 text-right">
								<svg
									class="w-5 h-5 text-gray-400 transition-transform duration-200"
									class:rotate-180={expandedIndex === i}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</td>
						</tr>
						{#if expandedIndex === i}
							<tr class="bg-[var(--color-card)]">
								<td colspan={showCapacity ? 6 : 5} class="p-6">
									<div class="flex items-center justify-between">
										<div class="text-gray-400">
											<p class="mb-2">Contact us for more details about this space.</p>
										</div>
										<a
											href="#contact"
											class="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm tracking-wider uppercase hover:bg-[var(--color-secondary)] transition-colors"
										>
											Inquire Now
										</a>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile Cards -->
		<div class="md:hidden space-y-4">
			{#each spaces as space, i}
				<div
					class="border border-[var(--color-border)] p-6 animate-on-scroll animate-fade-up"
					style:transition-delay="{i * 0.05}s"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center gap-3">
							{#if space.available}
								<span class="w-2 h-2 rounded-full bg-green-500"></span>
							{/if}
							<div>
								<p class="text-white font-medium">{space.floor}, {space.name}</p>
								<p class="text-gray-500 text-sm">{space.spaceUse}</p>
							</div>
						</div>
						<span class="text-[var(--color-primary)] font-medium">{space.rentalRate}<span class="text-gray-500 text-sm">{space.rateUnit || '/MO'}</span></span>
					</div>
					<div class="flex items-center gap-6 text-sm text-gray-400">
						<span>{space.size} {space.sizeUnit || 'SF'}</span>
						{#if showCapacity && space.capacity && space.capacity !== '-'}
							<span class="flex items-center gap-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								{space.capacity}
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
