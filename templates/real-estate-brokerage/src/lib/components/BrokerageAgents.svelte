<script lang="ts">
	import { Mail, Phone } from 'lucide-svelte';

	export interface BrokerageAgentsProps {
		subtitle?: string;
		title?: string;
		description?: string;
		limit?: number;
		showSeeAll?: boolean;
		seeAllUrl?: string;
		viewAllText?: string;
		emptyStateText?: string;
		remotePreviewFragment?: string;
		agents?: Array<{
			name: string;
			title: string;
			image: string;
			phone?: string;
			email?: string;
			remoteUrl?: string;
			specialties?: string[];
		}>;
	}

	let {
		subtitle = '',
		title = '',
		description = '',
		limit = 6,
		showSeeAll = true,
		seeAllUrl = '#agents',
		viewAllText = '',
		emptyStateText = '',
		remotePreviewFragment = '#agent-preview-mobile-card',
		agents = []
	}: BrokerageAgentsProps = $props();

	let displayedAgents = $derived(agents.slice(0, limit));

	function getAgentRemoteUrl(agent: { remoteUrl?: string }): string | null {
		const normalized = typeof agent?.remoteUrl === 'string' ? agent.remoteUrl.trim() : '';
		return normalized || null;
	}

	function normalizeFragment(fragment?: string): string {
		const value = typeof fragment === 'string' ? fragment.trim() : '';
		if (!value) return '';
		return value.startsWith('#') ? value : `#${value}`;
	}

	function getRemotePreviewUrl(url?: string | null, fragment?: string): string {
		if (!url) return 'about:blank';
		const normalizedFragment = normalizeFragment(fragment);

		if (!normalizedFragment) {
			return getRemoteBaseUrl(url);
		}

		try {
			const parsed = new URL(url);
			parsed.hash = normalizedFragment;
			return parsed.toString();
		} catch {
			const baseUrl = url.split('#')[0];
			return `${baseUrl.replace(/\/$/, '')}${normalizedFragment}`;
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

	function getTelephoneHref(phone?: string): string {
		if (!phone) return '';
		return `tel:${phone.replace(/[^\d+]/g, '')}`;
	}
</script>

<section id="agents" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		{#if displayedAgents.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each displayedAgents as agent, index}
					{@const agentRemoteUrl = getAgentRemoteUrl(agent)}
					{#if agentRemoteUrl}
						<article
							class="group relative h-full border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative h-full min-h-[24rem] overflow-hidden bg-black">
								<iframe
									src={getRemotePreviewUrl(agentRemoteUrl, remotePreviewFragment)}
									title={`${agent.name} preview`}
									class="absolute inset-0 w-full h-full border-0 bg-black pointer-events-none remote-agent-frame"
									loading="lazy"
									scrolling="no"
									sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
								></iframe>
								<a
									href={getRemoteBaseUrl(agentRemoteUrl)}
									target="_blank"
									rel="noopener noreferrer"
									class="absolute inset-0 z-10"
									aria-label={`View ${agent.name}'s profile`}
								></a>
							</div>
						</article>
					{:else}
						<div
							class="group border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 animate-on-scroll animate-fade-up"
							style="animation-delay: {index * 100}ms"
						>
							<div class="relative aspect-[3/4] overflow-hidden">
								<img
									src={agent.image}
									alt={agent.name}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>
							<div class="p-6">
								<h3 class="text-white text-xl font-light mb-1">{agent.name}</h3>
								<p class="text-[var(--color-primary)] text-sm mb-3">{agent.title}</p>
								{#if agent.specialties && agent.specialties.length > 0}
									<div class="flex flex-wrap gap-2 mb-4">
										{#each agent.specialties.slice(0, 3) as specialty}
											<span
												class="text-xs text-gray-400 px-2 py-1 border border-[var(--color-border)]"
												>{specialty}</span
											>
										{/each}
									</div>
								{/if}
								<div class="flex flex-col gap-2 text-sm">
									{#if agent.email}
										<a
											href="mailto:{agent.email}"
											class="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
											aria-label={`Email ${agent.name}`}
										>
											<Mail size={14} strokeWidth={1.75} />
											<span>{agent.email}</span>
										</a>
									{/if}
									{#if agent.phone}
										<a
											href={getTelephoneHref(agent.phone)}
											class="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
											aria-label={`Call ${agent.name}`}
										>
											<Phone size={14} strokeWidth={1.75} />
											<span>{agent.phone}</span>
										</a>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			{#if showSeeAll && agents.length > limit}
				<div class="text-center mt-12 animate-on-scroll animate-fade-up">
					<a
						href={seeAllUrl}
						class="cursor-pointer inline-block px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 text-sm tracking-wider uppercase"
					>
						{viewAllText}
					</a>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">{emptyStateText}</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.remote-agent-frame {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: hidden;
	}

	.remote-agent-frame::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
</style>
