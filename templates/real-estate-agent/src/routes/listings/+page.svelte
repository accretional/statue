<script lang="ts">
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	import config from '../../../site.config.json';

	interface Property {
		id: string;
		title: string;
		address: string;
		price: string;
		beds?: number;
		baths?: number;
		sqft?: number;
		type?: string;
		yearBuilt?: number;
		lotSize?: string | null;
		status: 'active' | 'pending' | 'sold';
		image: string;
		images?: string[];
		description?: string;
		features?: string[];
		url?: string;
		soldPrice?: string;
		soldDate?: string;
		remoteUrl?: string;
		externalUrl?: string; // Opens in new tab to remote site
		isRemote?: boolean; // True if data was fetched from remote real-estate template
	}

	interface ListingsPageData {
		site?: {
			name?: string;
		};
		agent?: {
			listings?: Property[] | Record<string, unknown>;
		};
		listings?: Property[] | Record<string, unknown>;
		properties?: Property[] | Record<string, unknown>;
	}

	let { data } = $props<{ data: ListingsPageData }>();

	const fallbackListings: Property[] = (config.agent?.listings?.items || []) as Property[];

	function normalizeListings(input: unknown): Property[] | null {
		if (Array.isArray(input)) {
			return input as Property[];
		}

		if (input && typeof input === 'object') {
			const maybeObject = input as Record<string, unknown>;
			const nestedListings =
				(Array.isArray(maybeObject.items) && maybeObject.items) ||
				(Array.isArray(maybeObject.properties) && maybeObject.properties) ||
				(Array.isArray(maybeObject.data) && maybeObject.data) ||
				(Array.isArray(maybeObject.results) && maybeObject.results);

			if (nestedListings) {
				return nestedListings as Property[];
			}
		}

		return null;
	}

	let allListings = $derived.by(() => {
		return (
			normalizeListings(data?.agent?.listings) ||
			normalizeListings(data?.listings) ||
			normalizeListings(data?.properties) ||
			fallbackListings
		);
	});

	let siteName = $derived(data?.site?.name || config.site?.name || 'Real Estate Agent');

	function parsePrice(priceText?: string): number {
		if (!priceText) return 0;
		const numeric = Number(priceText.replace(/[^0-9.]/g, ''));
		return Number.isFinite(numeric) ? numeric : 0;
	}

	const REMOTE_GRID_PREVIEW_FRAGMENT = '#listing-preview-mobile-card';
	const REMOTE_LIST_PREVIEW_FRAGMENT = '#listing-preview-list-card';

	function getRemotePreviewUrl(
		url?: string,
		fragment: string = REMOTE_GRID_PREVIEW_FRAGMENT
	): string {
		if (!url) return 'about:blank';

		try {
			const parsed = new URL(url);
			parsed.hash = fragment;
			return parsed.toString();
		} catch {
			const baseUrl = url.split('#')[0];
			return `${baseUrl.replace(/\/$/, '')}${fragment}`;
		}
	}

	function getRemoteBaseUrl(url?: string): string {
		if (!url) return '#';

		try {
			const parsed = new URL(url);
			parsed.hash = '';
			return parsed.toString();
		} catch {
			return url.split('#')[0];
		}
	}

	function getListingRemoteUrl(listing: Property): string | null {
		return listing.externalUrl || listing.remoteUrl || null;
	}

	function isRemoteListing(listing: Property): boolean {
		return Boolean(getListingRemoteUrl(listing) || listing.isRemote);
	}

	let selectedStatus = $state<string>('');
	let selectedType = $state<string>('');
	let selectedPriceRange = $state<string>('');
	let searchQuery = $state<string>('');
	let minBeds = $state<number>(0);
	let minBaths = $state<number>(0);
	let sortBy = $state<'newest' | 'price-low' | 'price-high' | 'sqft-high'>('newest');
	let viewMode = $state<'grid' | 'list'>('grid');

	let filteredListings = $derived.by(() => {
		let result = allListings;

		if (selectedStatus) {
			let normalizedStatus = selectedStatus.toLowerCase();
			result = result.filter((l) => (l.status || '').toLowerCase() === normalizedStatus);
		}

		if (selectedType) {
			let normalizedType = selectedType.toLowerCase();
			result = result.filter((l) => (l.type || '').toLowerCase() === normalizedType);
		}

		if (selectedPriceRange) {
			let [min, max] = selectedPriceRange.split('-').map((value) => Number(value));
			result = result.filter((l) => {
				let price = parsePrice(l.price || l.soldPrice);
				return price >= min && price <= max;
			});
		}

		if (searchQuery.trim()) {
			let query = searchQuery.trim().toLowerCase();
			result = result.filter((l) => {
				let haystack = [l.title, l.address, l.description, l.type, ...(l.features || [])]
					.filter(Boolean)
					.join(' ')
					.toLowerCase();
				return haystack.includes(query);
			});
		}

		if (minBeds > 0) {
			result = result.filter((l) => (l.beds || 0) >= minBeds);
		}

		if (minBaths > 0) {
			result = result.filter((l) => (l.baths || 0) >= minBaths);
		}

		if (sortBy === 'price-low') {
			result = [...result].sort((a, b) => parsePrice(a.price || a.soldPrice) - parsePrice(b.price || b.soldPrice));
		} else if (sortBy === 'price-high') {
			result = [...result].sort((a, b) => parsePrice(b.price || b.soldPrice) - parsePrice(a.price || a.soldPrice));
		} else if (sortBy === 'sqft-high') {
			result = [...result].sort((a, b) => (b.sqft || 0) - (a.sqft || 0));
		}

		return result;
	});

	let allTypes = $derived.by(() =>
		[...new Set(allListings.map((l) => l.type).filter((type): type is string => Boolean(type)))]
	);

	let selectedListing = $state<Property | null>(null);
	let selectedImageIndex = $state(0);

	let selectedListingImages = $derived.by(() => {
		if (!selectedListing) {
			return [];
		}

		if (selectedListing.images?.length) {
			return selectedListing.images;
		}

		return selectedListing.image ? [selectedListing.image] : [];
	});

	function openListingDetails(listing: Property) {
		// Remote listings show iframe in modal, local listings show details
		selectedListing = listing;
		selectedImageIndex = 0;
	}

	function closeListingDetails() {
		selectedListing = null;
		selectedImageIndex = 0;
	}

	function prevImage() {
		if (selectedListingImages.length < 2) {
			return;
		}

		selectedImageIndex =
			(selectedImageIndex - 1 + selectedListingImages.length) % selectedListingImages.length;
	}

	function nextImage() {
		if (selectedListingImages.length < 2) {
			return;
		}

		selectedImageIndex = (selectedImageIndex + 1) % selectedListingImages.length;
	}

	$effect(() => {
		if (typeof document === 'undefined') {
			return;
		}

		document.body.style.overflow = selectedListing ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (!selectedListing || typeof window === 'undefined') {
			return;
		}

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeListingDetails();
			}
			if (event.key === 'ArrowLeft') {
				prevImage();
			}
			if (event.key === 'ArrowRight') {
				nextImage();
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function resetFilters() {
		selectedStatus = '';
		selectedType = '';
		selectedPriceRange = '';
		searchQuery = '';
		minBeds = 0;
		minBaths = 0;
		sortBy = 'newest';
	}
</script>

<svelte:head>
	<title>Listings - {siteName}</title>
	<meta name="description" content="Browse all available properties" />
</svelte:head>

<div class="min-h-screen bg-[var(--color-background)] pt-24 md:pt-28">
	<!-- Anchors for navbar links (hidden) -->
	<div id="hero" class="sr-only"></div>
	<div id="about" class="sr-only"></div>
	<div id="services" class="sr-only"></div>
	<div id="contact" class="sr-only"></div>
	<div id="testimonials" class="sr-only"></div>
	<div id="listings" class="sr-only"></div>

	<!-- Hero Header -->
	<div class="bg-[var(--color-card)] border-b border-[var(--color-border)] py-8 md:py-12 px-4">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-2xl md:text-4xl font-light text-white mb-2">Property Listings</h1>
			<p class="text-gray-400">
				{filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
			</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
		<!-- Simple Filters -->
		<div class="mb-8 filters-shell">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div class="w-full lg:max-w-xl">
					<label for="listing-search" class="sr-only">Search</label>
					<input
						id="listing-search"
						type="text"
						placeholder="Search by address, title, keyword..."
						bind:value={searchQuery}
						class="search-control"
					/>
				</div>

				<div class="flex items-center gap-2">
					<span class="filter-label !mb-0">View</span>
					<div class="inline-flex rounded-full bg-white/5 p-1">
						<button
							type="button"
							onclick={() => (viewMode = 'list')}
							class="h-9 px-3 inline-flex items-center gap-1 text-xs rounded-full cursor-pointer transition-colors {viewMode === 'list'
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
								: 'text-gray-300 hover:text-white'}"
							aria-label="List view"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="8" y1="6" x2="21" y2="6"></line>
								<line x1="8" y1="12" x2="21" y2="12"></line>
								<line x1="8" y1="18" x2="21" y2="18"></line>
								<circle cx="4" cy="6" r="1.5"></circle>
								<circle cx="4" cy="12" r="1.5"></circle>
								<circle cx="4" cy="18" r="1.5"></circle>
							</svg>
							List
						</button>
						<button
							type="button"
							onclick={() => (viewMode = 'grid')}
							class="h-9 px-3 inline-flex items-center gap-1 text-xs rounded-full cursor-pointer transition-colors {viewMode === 'grid'
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
								: 'text-gray-300 hover:text-white'}"
							aria-label="Grid view"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="3" width="7" height="7"></rect>
								<rect x="14" y="3" width="7" height="7"></rect>
								<rect x="3" y="14" width="7" height="7"></rect>
								<rect x="14" y="14" width="7" height="7"></rect>
							</svg>
							Grid
						</button>
					</div>
				</div>
			</div>

			<div class="mt-4 flex flex-wrap items-center gap-2">
				<button
					type="button"
					onclick={() => (selectedStatus = '')}
					class="status-chip {selectedStatus === '' ? 'status-chip-active' : ''}"
				>
					All
				</button>
				<button
					type="button"
					onclick={() => (selectedStatus = 'active')}
					class="status-chip {selectedStatus === 'active' ? 'status-chip-active' : ''}"
				>
					Active
				</button>
				<button
					type="button"
					onclick={() => (selectedStatus = 'pending')}
					class="status-chip {selectedStatus === 'pending' ? 'status-chip-active' : ''}"
				>
					Pending
				</button>
				<button
					type="button"
					onclick={() => (selectedStatus = 'sold')}
					class="status-chip {selectedStatus === 'sold' ? 'status-chip-active' : ''}"
				>
					Sold
				</button>
			</div>

			<div class="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
				{#if allTypes.length > 0}
					<select id="listing-type" bind:value={selectedType} class="minimal-select">
						<option value="">Type: All</option>
						{#each allTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				{/if}

				<select id="listing-price-range" bind:value={selectedPriceRange} class="minimal-select">
					<option value="">Price: Any</option>
					<option value="0-1000000">Under $1M</option>
					<option value="1000000-2000000">$1M - $2M</option>
					<option value="2000000-5000000">$2M - $5M</option>
					<option value="5000000-99999999">$5M+</option>
				</select>

				<select id="listing-min-beds" bind:value={minBeds} class="minimal-select">
					<option value={0}>Beds: Any</option>
					<option value={1}>Beds: 1+</option>
					<option value={2}>Beds: 2+</option>
					<option value={3}>Beds: 3+</option>
					<option value={4}>Beds: 4+</option>
					<option value={5}>Beds: 5+</option>
				</select>

				<select id="listing-min-baths" bind:value={minBaths} class="minimal-select">
					<option value={0}>Baths: Any</option>
					<option value={1}>Baths: 1+</option>
					<option value={2}>Baths: 2+</option>
					<option value={3}>Baths: 3+</option>
					<option value={4}>Baths: 4+</option>
				</select>

				<select id="listing-sort-by" bind:value={sortBy} class="minimal-select">
					<option value="newest">Sort: Default</option>
					<option value="price-low">Price: Low to High</option>
					<option value="price-high">Price: High to Low</option>
					<option value="sqft-high">Largest Sqft</option>
				</select>
			</div>

			{#if selectedStatus || selectedType || selectedPriceRange || searchQuery || minBeds > 0 || minBaths > 0 || sortBy !== 'newest'}
				<div class="mt-3">
					<button
						onclick={resetFilters}
						class="text-gray-400 hover:text-white text-sm underline cursor-pointer"
					>
						Clear all filters
					</button>
				</div>
			{/if}
		</div>

		<!-- Listings Grid -->
		{#if filteredListings.length > 0}
			{#if viewMode === 'grid'}
				<ListingsGrid listings={filteredListings} onSelect={openListingDetails} />
				{:else}
						<div class="space-y-4">
							{#each filteredListings as listing}
								{@const remoteUrl = getListingRemoteUrl(listing)}
								{#if isRemoteListing(listing)}
									<a
										href={getRemoteBaseUrl(remoteUrl || undefined)}
										target="_blank"
										rel="noopener noreferrer"
										class="block w-full text-left border border-[var(--color-border)] bg-[var(--color-card)] rounded-lg overflow-hidden hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
									>
										<div class="relative aspect-[16/9] sm:aspect-[21/8] lg:aspect-[24/5] bg-black overflow-hidden">
											<iframe
												src={getRemotePreviewUrl(remoteUrl || undefined, REMOTE_LIST_PREVIEW_FRAGMENT)}
												title={`${listing.title} list preview`}
												class="absolute inset-0 w-full h-full border-0 bg-black remote-list-frame pointer-events-none"
											loading="lazy"
											scrolling="no"
											sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
										></iframe>
									</div>
								</a>
							{:else}
								<button
									type="button"
									onclick={() => openListingDetails(listing)}
									class="w-full text-left border border-[var(--color-border)] bg-[var(--color-card)] rounded-lg overflow-hidden hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
								>
									<div class="grid md:grid-cols-[320px_1fr]">
										<div class="relative aspect-[4/3] md:aspect-[4/3] bg-gray-900 overflow-hidden">
											<img src={listing.image} alt={listing.title} class="w-full h-full object-cover absolute inset-0" />
											{#if listing.status === 'sold'}
												<div class="absolute inset-0 bg-black/28"></div>
											{/if}
											<div class="absolute top-3 right-3">
												<span class="px-3 py-1 text-xs font-medium border rounded-full uppercase bg-black/45 text-white border-white/20">
													{listing.status}
												</span>
											</div>
										</div>
										<div class="p-5">
											<div class="flex flex-wrap items-start justify-between gap-3">
												<div>
													<h3 class="text-white text-lg md:text-xl font-light">{listing.title}</h3>
													<p class="text-gray-400 text-sm mt-1">{listing.address}</p>
												</div>
												<p class="text-[var(--color-primary)] text-xl font-light">{listing.price}</p>
											</div>
											<div class="mt-4 flex flex-wrap gap-4 text-gray-300 text-sm">
												<span>{listing.beds || '-'} bd</span>
												<span>{listing.baths || '-'} ba</span>
												<span>{listing.sqft ? listing.sqft.toLocaleString() : '-'} sqft</span>
												<span>{listing.type || '-'}</span>
											</div>
											{#if listing.description}
												<p class="mt-3 text-sm text-gray-400 line-clamp-2">{listing.description}</p>
											{/if}
										</div>
									</div>
								</button>
							{/if}
						{/each}
					</div>
				{/if}
		{:else}
			<div class="text-center py-16">
				<div class="mb-4 text-gray-600">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto">
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
						<polyline points="9 22 9 12 15 12 15 22"/>
					</svg>
				</div>
				<p class="text-gray-400 text-lg">No properties match your criteria</p>
				<button
					onclick={resetFilters}
					class="mt-4 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded cursor-pointer"
				>
					Reset Filters
				</button>
			</div>
		{/if}
	</div>

	{#if selectedListing}
		<div
			class="fixed inset-0 z-[120] bg-black"
			onclick={closeListingDetails}
		>
			<!-- Top bar with buttons -->
			<div class="fixed top-0 left-0 right-0 z-[130] h-16 bg-black/80 backdrop-blur border-b border-white/10 flex items-center justify-between px-4">
					<div class="text-white text-sm">
						{selectedListing.title}
					</div>
					<div class="flex items-center gap-2">
						{#if isRemoteListing(selectedListing)}
							<a
								href={getRemoteBaseUrl(getListingRemoteUrl(selectedListing) || undefined)}
								target="_blank"
								rel="noopener noreferrer"
								class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 cursor-pointer border border-white/20"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
								<polyline points="15 3 21 3 21 9"></polyline>
								<line x1="10" y1="14" x2="21" y2="3"></line>
							</svg>
							Open in new tab
						</a>
					{/if}
					<button
						type="button"
						onclick={closeListingDetails}
						class="h-9 w-9 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer border border-white/20"
						aria-label="Close"
					>
						✕
					</button>
				</div>
			</div>

			<div
				class="w-full h-full pt-16"
				onclick={(event) => event.stopPropagation()}
			>
			{#if isRemoteListing(selectedListing)}
					<!-- Remote listing: fullscreen iframe -->
					<iframe
						src={getRemotePreviewUrl(getListingRemoteUrl(selectedListing) || undefined)}
						class="w-full h-screen border-0"
						title={selectedListing.title}
						sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
					></iframe>
				{:else}
					<!-- Local listing: centered container -->
					<div class="max-w-6xl mx-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden my-4">
						<!-- Header -->
						<div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
							<div>
								<h2 class="text-xl md:text-2xl font-light text-white">{selectedListing.title}</h2>
								<p class="text-sm text-gray-400 mt-1">{selectedListing.address}</p>
							</div>
						</div>
						<!-- Details -->
						<div class="grid lg:grid-cols-[1.3fr_1fr]">
							<div class="p-4 md:p-5 border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
								<div class="relative aspect-[16/10] bg-black/20 rounded-lg overflow-hidden">
								<img
									src={selectedListingImages[selectedImageIndex] || selectedListing.image}
									alt={selectedListing.title}
									class="w-full h-full object-cover"
								/>
								{#if selectedListingImages.length > 1}
									<button
										type="button"
										onclick={prevImage}
										class="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white cursor-pointer"
										aria-label="Previous image"
									>
										‹
									</button>
									<button
										type="button"
										onclick={nextImage}
										class="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white cursor-pointer"
										aria-label="Next image"
									>
										›
									</button>
								{/if}
							</div>

							{#if selectedListingImages.length > 1}
								<div class="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
									{#each selectedListingImages as image, index}
										<button
											type="button"
											onclick={() => (selectedImageIndex = index)}
											class="aspect-[4/3] rounded overflow-hidden border cursor-pointer {index === selectedImageIndex
												? 'border-[var(--color-primary)]'
												: 'border-[var(--color-border)]'}"
											aria-label={`Open image ${index + 1}`}
										>
											<img src={image} alt={`${selectedListing.title} image ${index + 1}`} class="w-full h-full object-cover" />
										</button>
									{/each}
								</div>
							{/if}
						</div>

						<div class="p-5 md:p-6">
							<p class="text-2xl md:text-3xl text-[var(--color-primary)] font-light mb-4">
								{selectedListing.status === 'sold' && selectedListing.soldPrice
									? selectedListing.soldPrice
									: selectedListing.price}
							</p>

							<div class="grid grid-cols-2 gap-3 text-sm mb-5">
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Beds</p>
									<p class="text-white text-lg">{selectedListing.beds || '-'}</p>
								</div>
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Baths</p>
									<p class="text-white text-lg">{selectedListing.baths || '-'}</p>
								</div>
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Sqft</p>
									<p class="text-white text-lg">{selectedListing.sqft ? selectedListing.sqft.toLocaleString() : '-'}</p>
								</div>
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Type</p>
									<p class="text-white text-lg">{selectedListing.type || '-'}</p>
								</div>
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Year Built</p>
									<p class="text-white text-lg">{selectedListing.yearBuilt || '-'}</p>
								</div>
								<div class="bg-black/15 rounded p-3">
									<p class="text-gray-400">Lot Size</p>
									<p class="text-white text-lg">{selectedListing.lotSize || '-'}</p>
								</div>
							</div>

							{#if selectedListing.description}
								<div class="mb-5">
									<h3 class="text-white text-base mb-2">Overview</h3>
									<p class="text-gray-300 leading-relaxed text-sm">{selectedListing.description}</p>
								</div>
							{/if}

							{#if selectedListing.features?.length}
								<div class="mb-5">
									<h3 class="text-white text-base mb-2">Features</h3>
									<div class="flex flex-wrap gap-2">
										{#each selectedListing.features as feature}
											<span class="px-3 py-1 rounded-full bg-black/20 border border-[var(--color-border)] text-gray-200 text-xs">
												{feature}
											</span>
										{/each}
									</div>
								</div>
							{/if}

							{#if selectedListing.status === 'sold' && selectedListing.soldDate}
								<p class="text-sm text-gray-400">Sold date: {selectedListing.soldDate}</p>
							{/if}
						</div>
					</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.filter-label {
		display: block;
		font-size: 0.8rem;
		color: #9ca3af;
		margin-bottom: 0.4rem;
	}

	.filters-shell {
		background: color-mix(in srgb, var(--color-card) 45%, transparent);
		border-radius: 1rem;
		padding: 1rem;
	}

	.search-control {
		width: 100%;
		height: 2.8rem;
		padding: 0 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-background) 65%, transparent);
		color: #fff;
	}

	.search-control::placeholder {
		color: #6b7280;
	}

	.search-control:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.status-chip {
		height: 2rem;
		padding: 0 0.8rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-background) 80%, transparent);
		color: #c5c8d0;
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 120ms ease;
	}

	.status-chip:hover {
		color: #fff;
	}

	.status-chip-active {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}

	.minimal-select {
		width: 100%;
		height: 2.4rem;
		padding: 0 0.75rem;
		background: color-mix(in srgb, var(--color-background) 80%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
		border-radius: 0.65rem;
		color: #fff;
		font-size: 0.9rem;
	}

	.minimal-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.remote-list-frame {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: hidden;
	}

	.remote-list-frame::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
</style>
