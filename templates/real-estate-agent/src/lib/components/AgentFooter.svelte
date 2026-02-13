<script lang="ts">
	import { page } from '$app/stores';

	export interface AgentFooterProps {
		brand?: string;
		tagline?: string;
		copyrightText?: string;
		agentName?: string;
		license?: string;
		social?: {
			linkedin?: string;
			facebook?: string;
			instagram?: string;
			twitter?: string;
		};
		quickLinks?: Array<{
			title: string;
			url: string;
		}>;
	}

	let {
		brand = 'Real Estate Agent',
		tagline = 'Your trusted partner in real estate',
		copyrightText = 'All rights reserved',
		agentName = '',
		license = '',
		social = {},
		quickLinks = []
	}: AgentFooterProps = $props();

	let currentYear = new Date().getFullYear();
</script>

<footer class="py-16 px-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
	<div class="max-w-6xl mx-auto">
		<div class="grid md:grid-cols-3 gap-12 mb-12">
			<!-- Brand -->
			<div>
				<h3 class="text-white text-xl font-medium mb-3">{brand}</h3>
				<p class="text-gray-400 text-sm mb-4">{tagline}</p>
				{#if agentName}
					<p class="text-gray-500 text-sm">{agentName}</p>
				{/if}
				{#if license}
					<p class="text-gray-600 text-xs mt-1">License #{license}</p>
				{/if}
			</div>

			<!-- Quick Links -->
			{#if quickLinks.length > 0}
				<div>
					<h4 class="text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
					<ul class="space-y-2">
						{#each quickLinks as link}
							<li>
								<a
									href={link.url}
									class="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm"
								>
									{link.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Social -->
			{#if Object.keys(social).length > 0}
				<div>
					<h4 class="text-white text-sm uppercase tracking-wider mb-4">Follow Me</h4>
					<div class="flex gap-4">
						{#if social.linkedin}
							<a
								href={social.linkedin}
								target="_blank"
								rel="noopener"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
							>
								LinkedIn
							</a>
						{/if}
						{#if social.facebook}
							<a
								href={social.facebook}
								target="_blank"
								rel="noopener"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
							>
								Facebook
							</a>
						{/if}
						{#if social.instagram}
							<a
								href={social.instagram}
								target="_blank"
								rel="noopener"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
							>
								Instagram
							</a>
						{/if}
						{#if social.twitter}
							<a
								href={social.twitter}
								target="_blank"
								rel="noopener"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
							>
								Twitter
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Copyright -->
		<div class="pt-8 border-t border-[var(--color-border)] text-center">
			<p class="text-gray-500 text-sm">
				© {currentYear} {brand}. {copyrightText}.
			</p>
		</div>
	</div>
</footer>
