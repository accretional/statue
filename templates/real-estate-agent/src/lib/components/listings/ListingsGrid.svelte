<script lang="ts">
	export interface Property {
		id: string;
		title: string;
		address: string;
		price: string;
		beds?: number;
		baths?: number;
		sqft?: number;
		type?: string;
		status?: 'active' | 'pending' | 'sold';
		image: string;
		images?: string[];
		description?: string;
		features?: string[];
		url?: string;
		soldPrice?: string;
		soldDate?: string;
		remoteUrl?: string;
		externalUrl?: string; // Remote site URL - renders as direct iframe card
		isRemote?: boolean; // True if data was fetched from remote real-estate template
	}

	let {
		listings = [],
		onSelect
	}: {
		listings: Property[];
		onSelect?: (listing: Property) => void;
	} = $props();

	function handleListingClick(event: MouseEvent, listing: Property) {
		if (!onSelect) {
			return;
		}
		event.preventDefault();
		onSelect(listing);
	}

	const REMOTE_PREVIEW_FRAGMENT = '#listing-preview-mobile-card';

	function getRemotePreviewUrl(url?: string): string {
		if (!url) return 'about:blank';

		try {
			const parsed = new URL(url);
			parsed.hash = REMOTE_PREVIEW_FRAGMENT;
			return parsed.toString();
		} catch {
			const baseUrl = url.split('#')[0];
			return `${baseUrl.replace(/\/$/, '')}${REMOTE_PREVIEW_FRAGMENT}`;
		}
	}

	function getListingRemoteUrl(listing: Property): string | null {
		const url = listing.externalUrl || listing.remoteUrl;
		const normalized = typeof url === 'string' ? url.trim() : '';
		return normalized || null;
	}

	function getListingStatus(listing: Property): 'active' | 'pending' | 'sold' {
		const status = listing.status || 'active';
		if (status === 'pending' || status === 'sold') return status;
		return 'active';
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

	function getStatusBadge(status: string) {
		switch (status) {
			case 'active':
				return 'bg-green-500/20 text-green-400 border-green-500/50';
			case 'pending':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
			case 'sold':
				return 'bg-red-500/20 text-red-400 border-red-500/50';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
		}
	}
</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
	{#each listings as listing}
		{@const remoteUrl = getListingRemoteUrl(listing)}
		{#if remoteUrl || listing.isRemote}
			<article
				class="group relative w-full bg-[var(--color-card)] overflow-hidden transition-all duration-300"
			>
				<div class="relative aspect-[4/5] overflow-hidden bg-black leading-none">
					<iframe
						src={getRemotePreviewUrl(remoteUrl || undefined)}
						title={`${listing.title || 'Listing'} preview`}
						class="absolute inset-0 w-full h-full border-0 bg-black remote-frame pointer-events-none"
						loading="lazy"
						scrolling="no"
						sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
					></iframe>
					<a
						href={getRemoteBaseUrl(remoteUrl || undefined)}
						target="_blank"
						rel="noopener noreferrer"
						class="absolute inset-0 z-10"
						aria-label={`Open ${listing.title} in new tab`}
					>
						<span class="sr-only">Open in new tab</span>
					</a>
					<div
						class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
					></div>
				</div>
			</article>
		{:else}
			<button
				type="button"
				onclick={(event) => handleListingClick(event, listing)}
				class="group block w-full align-top leading-none p-0 m-0 appearance-none text-left bg-[var(--color-card)] overflow-hidden transition-all duration-300 cursor-pointer"
			>
				<!-- Image -->
				<div class="relative aspect-[4/3] overflow-hidden bg-gray-900 leading-none">
					<img
						src={listing.image}
						alt={listing.title}
						class="absolute inset-0 block w-full h-full min-h-full object-cover object-center transition-transform duration-500 pointer-events-none group-hover:scale-105"
					/>
					{#if getListingStatus(listing) === 'sold'}
						<div class="absolute inset-0 bg-black/28 pointer-events-none"></div>
					{/if}
					<!-- Status Badge -->
					<div class="absolute top-3 right-3">
						<span
							class="px-3 py-1 text-xs font-medium border rounded-full uppercase {getStatusBadge(
								getListingStatus(listing)
							)}"
						>
							{getListingStatus(listing)}
						</span>
					</div>
					<!-- Type Badge -->
					{#if listing.type}
						<div class="absolute top-3 left-3">
							<span class="px-2 py-1 text-xs bg-black/50 text-white rounded">
								{listing.type}
							</span>
						</div>
					{/if}
				</div>

				<!-- Content -->
				<div class="p-5">
					<div class="flex justify-between items-start mb-2">
						<h3 class="text-white text-lg font-light">{listing.title}</h3>
					</div>
					<p class="text-gray-400 text-sm mb-3 line-clamp-1">{listing.address}</p>
					<p class="text-[var(--color-primary)] text-xl font-light mb-3">{listing.price}</p>

					<!-- Details -->
					{#if listing.beds || listing.baths || listing.sqft}
						<div class="flex flex-wrap gap-3 text-gray-400 text-sm">
							{#if listing.beds}
								<span class="flex items-center gap-1">
									<span class="text-[var(--color-primary)]">✦</span>
									{listing.beds} bd
								</span>
							{/if}
							{#if listing.baths}
								<span class="flex items-center gap-1">
									<span class="text-[var(--color-primary)]">✦</span>
									{listing.baths} ba
								</span>
							{/if}
							{#if listing.sqft}
								<span class="flex items-center gap-1">
									<span class="text-[var(--color-primary)]">✦</span>
									{listing.sqft.toLocaleString()} sqft
								</span>
							{/if}
						</div>
					{/if}

					{#if getListingStatus(listing) === 'sold' && listing.soldDate}
						<p class="text-gray-500 text-xs mt-2">Sold {listing.soldDate}</p>
					{/if}
				</div>
			</button>
		{/if}
	{/each}
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.remote-frame {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: hidden;
	}

	.remote-frame::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
</style>
