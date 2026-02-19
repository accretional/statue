<script lang="ts">
	export interface BrokerageListingsProps {
		subtitle?: string;
		title?: string;
		description?: string;
		limit?: number;
		showSeeAll?: boolean;
		seeAllUrl?: string;
		listings?: Array<{
			id?: string;
			title: string;
			address?: string;
			price: string;
			image: string;
			remoteUrl?: string;
			beds?: number;
			baths?: number;
			sqft?: number;
			type?: string;
			status?: 'active' | 'pending' | 'sold';
		}>;
	}

	let {
		subtitle = 'Properties',
		title = 'Featured Listings',
		description = 'Discover exceptional properties curated by our expert team.',
		limit = 6,
		showSeeAll = true,
		seeAllUrl = '/listings',
		listings = []
	}: BrokerageListingsProps = $props();

	let displayedListings = $derived(listings.slice(0, limit));

	const REMOTE_PREVIEW_FRAGMENT = '#listing-preview-mobile-card';

	function getRemotePreviewUrl(url?: string | null): string {
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
				return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
			case 'pending':
				return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
			case 'sold':
				return 'bg-red-500/15 text-red-400 border-red-500/40';
			default:
				return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
		}
	}
</script>

<section id="listings" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		{#if displayedListings.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each displayedListings as listing, index}
					{#if listing.remoteUrl}
						<article
							class="group relative overflow-hidden animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative aspect-[4/5] overflow-hidden bg-black">
								<iframe
									src={getRemotePreviewUrl(listing.remoteUrl)}
									title={`${listing.title || 'Property'} preview`}
									class="absolute inset-0 w-full h-full border-0 bg-black pointer-events-none remote-listing-frame"
									loading="lazy"
									scrolling="no"
									sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
								></iframe>
								<a
									href={getRemoteBaseUrl(listing.remoteUrl)}
									target="_blank"
									rel="noopener noreferrer"
									class="absolute inset-0 z-10"
									aria-label={`View ${listing.title || 'property'} details`}
								></a>
							</div>
						</article>
					{:else}
						<div
							class="group border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative aspect-[4/3] overflow-hidden">
								<img
									src={listing.image}
									alt={listing.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								{#if listing.status}
									<div class="absolute top-4 right-4">
										<span class="px-3 py-1 text-xs font-medium border rounded-full uppercase {getStatusBadge(listing.status)}">
											{listing.status}
										</span>
									</div>
								{/if}
								{#if listing.type}
									<div class="absolute top-4 left-4">
										<span class="px-2 py-1 text-xs bg-black/50 text-white rounded">{listing.type}</span>
									</div>
								{/if}
							</div>
							<div class="p-6">
								<h3 class="text-white text-xl font-light mb-2">{listing.title || 'Luxury Property'}</h3>
								{#if listing.address}
									<p class="text-gray-400 text-sm mb-3">{listing.address}</p>
								{/if}
								<p class="text-[var(--color-primary)] text-2xl font-light mb-4">{listing.price || 'Contact for Price'}</p>
								{#if listing.beds || listing.baths || listing.sqft}
									<div class="flex flex-wrap gap-4 text-gray-400 text-sm">
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
							</div>
						</div>
					{/if}
				{/each}
			</div>

			{#if showSeeAll && listings.length > limit}
				<div class="text-center mt-12 animate-on-scroll animate-fade-up">
					<a
						href={seeAllUrl}
						class="cursor-pointer inline-block px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 text-sm tracking-wider uppercase"
					>
						View All Listings
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
	.remote-listing-frame {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: hidden;
	}

	.remote-listing-frame::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
</style>
