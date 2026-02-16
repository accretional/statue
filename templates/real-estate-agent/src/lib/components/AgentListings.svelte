<script lang="ts">
	export interface AgentListingsProps {
		subtitle?: string;
		title?: string;
		description?: string;
		limit?: number;
		status?: string[];
		showSeeAll?: boolean;
		seeAllUrl?: string;
		listings?: Array<{
			id: string;
			title: string;
			address: string;
			price: string;
			image: string;
			remoteUrl?: string;
			externalUrl?: string;
			isRemote?: boolean;
			beds?: number;
			baths?: number;
			sqft?: number;
			type?: string;
			status?: 'active' | 'pending' | 'sold';
			url?: string;
		}>;
	}

	let {
		subtitle = 'Properties',
		title = 'Featured Listings',
		description = 'Browse my current properties available for sale',
		limit = 3,
		status = ['active', 'pending'],
		showSeeAll = true,
		seeAllUrl = '/listings',
		listings = []
	}: AgentListingsProps = $props();

	// Filter listings by status
	let filteredListings = $derived(
		listings.filter((l) => status.includes((l.status || 'active').toLowerCase())).slice(0, limit)
	);

	const REMOTE_GRID_PREVIEW_FRAGMENT = '#listing-preview-mobile-card';

	function getListingRemoteUrl(listing: {
		remoteUrl?: string;
		externalUrl?: string;
		isRemote?: boolean;
	}): string | null {
		const url = listing.externalUrl || listing.remoteUrl;
		const normalized = typeof url === 'string' ? url.trim() : '';
		return normalized || null;
	}

	function getRemotePreviewUrl(url?: string | null): string {
		if (!url) return 'about:blank';

		try {
			const parsed = new URL(url);
			parsed.hash = REMOTE_GRID_PREVIEW_FRAGMENT;
			return parsed.toString();
		} catch {
			const baseUrl = url.split('#')[0];
			return `${baseUrl.replace(/\/$/, '')}${REMOTE_GRID_PREVIEW_FRAGMENT}`;
		}
	}

	function getRemoteBaseUrl(url?: string | null): string {
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

	function getListingStatus(listing: { status?: string }): string {
		return (listing.status || 'active').toLowerCase();
	}
</script>

<section id="listings" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		{#if filteredListings.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredListings as listing, index}
					{@const remoteUrl = getListingRemoteUrl(listing)}
					{#if remoteUrl || listing.isRemote}
						<article
							class="group relative w-full bg-[var(--color-card)] overflow-hidden transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative aspect-[4/5] overflow-hidden bg-black leading-none">
								<iframe
									src={getRemotePreviewUrl(remoteUrl)}
									title={`${listing.title || 'Listing'} preview`}
									class="absolute inset-0 w-full h-full border-0 bg-black pointer-events-none remote-home-frame"
									loading="lazy"
									scrolling="no"
									sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
								></iframe>
								<a
									href={getRemoteBaseUrl(remoteUrl)}
									target="_blank"
									rel="noopener noreferrer"
									class="absolute inset-0 z-10"
									aria-label={`Open ${listing.title || 'listing'} in new tab`}
								></a>
								<div
									class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
								></div>
							</div>
						</article>
					{:else}
						<div
							class="group border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-primary)] transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative aspect-[4/3] overflow-hidden">
								<img
									src={listing.image}
									alt={listing.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div class="absolute top-4 right-4">
									<span
										class="px-3 py-1 text-xs font-medium border rounded-full uppercase {getStatusBadge(
											getListingStatus(listing)
										)}"
									>
										{getListingStatus(listing)}
									</span>
								</div>
							</div>
							<div class="p-6">
								<h3 class="text-white text-xl font-light mb-2">
									{listing.title || 'Luxury Property'}
								</h3>
								{#if listing.address}
									<p class="text-gray-400 text-sm mb-4">{listing.address}</p>
								{/if}
								<p class="text-[var(--color-primary)] text-2xl font-light mb-4">
									{listing.price || 'Contact for Price'}
								</p>
								{#if listing.beds || listing.baths || listing.sqft}
									<div class="flex flex-wrap gap-4 text-gray-400 text-sm mb-4">
										{#if listing.beds}
											<span>{listing.beds} Beds</span>
										{/if}
										{#if listing.baths}
											<span>{listing.baths} Baths</span>
										{/if}
										{#if listing.sqft}
											<span>{listing.sqft.toLocaleString()} SF</span>
										{/if}
									</div>
								{/if}
								{#if listing.url}
									<a
										href={listing.url}
										class="cursor-pointer inline-block text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors text-sm uppercase tracking-wider"
									>
										View Details →
									</a>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<!-- See All Button -->
			{#if showSeeAll && listings.length > limit}
				<div class="text-center mt-12 animate-on-scroll animate-fade-up">
					<a
						href={seeAllUrl}
						class="cursor-pointer inline-block px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 text-sm tracking-wider uppercase"
					>
						See All Listings
					</a>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">No listings available at the moment.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.remote-home-frame {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: hidden;
	}

	.remote-home-frame::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
</style>
