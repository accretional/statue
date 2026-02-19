<script lang="ts">
	export interface BrokerageFooterProps {
		brand?: string;
		tagline?: string;
		copyrightText?: string;
		license?: string;
		quickLinks?: Array<{
			title: string;
			url: string;
		}>;
		legalLinks?: Array<{
			title: string;
			url: string;
		}>;
		social?: {
			linkedin?: string;
			facebook?: string;
			instagram?: string;
			twitter?: string;
		};
	}

	let {
		brand = 'Prestige Realty Group',
		tagline = 'Excellence in Real Estate Since 1985',
		copyrightText = 'All rights reserved',
		license = 'DRE 01234567',
		quickLinks = [
			{ title: 'Home', url: '#hero' },
			{ title: 'About', url: '#about' },
			{ title: 'Services', url: '#services' },
			{ title: 'Listings', url: '#listings' },
			{ title: 'Agents', url: '#agents' },
			{ title: 'Contact', url: '#contact' }
		],
		legalLinks = [
			{ title: 'Privacy Policy', url: '/privacy' },
			{ title: 'Terms of Service', url: '/terms' },
			{ title: 'Fair Housing', url: '/fair-housing' }
		],
		social = {}
	}: BrokerageFooterProps = $props();

	let currentYear = new Date().getFullYear();
</script>

<footer class="py-16 px-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
	<div class="max-w-6xl mx-auto">
		<div class="grid md:grid-cols-4 gap-12 mb-12">
			<!-- Brand -->
			<div class="md:col-span-2">
				<h3 class="text-white text-2xl font-light mb-3">{brand}</h3>
				<p class="text-gray-400 text-sm mb-4 max-w-md">{tagline}</p>
				{#if license}
					<p class="text-gray-600 text-xs">License #{license}</p>
				{/if}
			</div>

			<!-- Quick Links -->
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

			<!-- Legal & Social -->
			<div>
				<h4 class="text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
				<ul class="space-y-2 mb-6">
					{#each legalLinks as link}
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

				{#if Object.keys(social).length > 0}
					<div class="flex gap-3">
						{#if social.linkedin}
							<a href={social.linkedin} target="_blank" rel="noopener" class="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">LinkedIn</a>
						{/if}
						{#if social.facebook}
							<a href={social.facebook} target="_blank" rel="noopener" class="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Facebook</a>
						{/if}
						{#if social.instagram}
							<a href={social.instagram} target="_blank" rel="noopener" class="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Instagram</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Copyright -->
		<div class="pt-8 border-t border-[var(--color-border)]">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-gray-500 text-sm">
					&copy; {currentYear} {brand}. {copyrightText}.
				</p>
				<p class="text-gray-600 text-xs">
					Equal Housing Opportunity
				</p>
			</div>
		</div>
	</div>
</footer>
