<script lang="ts">
	export interface AgentSoldProps {
		subtitle?: string;
		title?: string;
		description?: string;
		limit?: number;
		showSeeAll?: boolean;
		seeAllUrl?: string;
		listings?: Array<{
			id: string;
			title: string;
			address: string;
			price: string;
			soldPrice?: string;
			soldDate?: string;
			image: string;
			remoteUrl?: string;
			externalUrl?: string;
			isRemote?: boolean;
			status?: 'active' | 'pending' | 'sold';
			url?: string;
		}>;
	}

	let {
		subtitle = 'Recent Sales',
		title = 'Recently Sold',
		description = "Properties I've successfully helped my clients buy and sell",
		limit = 4,
		showSeeAll = false,
		seeAllUrl = '/listings?status=sold',
		listings = []
	}: AgentSoldProps = $props();

	// Filter sold listings
	let soldListings = $derived(
		listings.filter((l) => (l.status || 'active') === 'sold').slice(0, limit)
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
</script>

<section id="sold" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		{#if soldListings.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each soldListings as listing, index}
					{@const remoteUrl = getListingRemoteUrl(listing)}
					{#if remoteUrl || listing.isRemote}
						<article
							class="group relative w-full bg-[var(--color-card)] overflow-hidden transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 75}ms"
						>
							<div class="relative aspect-[4/5] overflow-hidden bg-black leading-none">
								<iframe
									src={getRemotePreviewUrl(remoteUrl)}
									title={`${listing.title || 'Sold listing'} preview`}
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
									aria-label={`Open ${listing.title || 'sold listing'} in new tab`}
								></a>
								<div
									class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
								></div>
							</div>
						</article>
					{:else}
						<div
							class="group animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 75}ms"
						>
							<div class="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
								<img
									src={listing.image}
									alt={listing.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div
									class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								>
									<span class="text-white text-lg font-light tracking-wider">SOLD</span>
								</div>
							</div>
							<h3 class="text-white font-light mb-1">{listing.title || 'Luxury Property'}</h3>
							{#if listing.address}
								<p class="text-gray-400 text-sm mb-2">{listing.address}</p>
							{/if}
							<p class="text-[var(--color-primary)] font-medium">
								{listing.soldPrice || listing.price || 'Contact for Price'}
							</p>
							{#if listing.soldDate}
								<p class="text-gray-500 text-xs mt-1">Sold {listing.soldDate}</p>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- See All Button -->
			{#if showSeeAll && listings.filter((l) => (l.status || 'active') === 'sold').length > limit}
				<div class="text-center mt-12 animate-on-scroll animate-fade-up">
					<a
						href={seeAllUrl}
						class="cursor-pointer inline-block px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 text-sm tracking-wider uppercase"
					>
						See All Sold Properties
					</a>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">Check back soon for recent sales!</p>
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
