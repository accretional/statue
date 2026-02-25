<script lang="ts">
	import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-svelte';

	export interface BrokerageContactProps {
		subtitle?: string;
		title?: string;
		description?: string;
		contactHeading?: string;
		hoursHeading?: string;
		socialHeading?: string;
		messageButtonText?: string;
		phone?: string;
		email?: string;
		address?: {
			street?: string;
			city?: string;
			state?: string;
			zipCode?: string;
		};
		hours?: Array<{
			days: string;
			time: string;
		}>;
		social?: {
			linkedin?: string;
			facebook?: string;
			instagram?: string;
			twitter?: string;
		};
	}

	let {
		subtitle = '',
		title = '',
		description = '',
		contactHeading = '',
		hoursHeading = '',
		socialHeading = '',
		messageButtonText = '',
		phone = '',
		email = '',
		address = {},
		hours = [],
		social = {}
	}: BrokerageContactProps = $props();

	let fullAddress = $derived(
		[address?.street, address?.city, address?.state, address?.zipCode].filter(Boolean).join(', ')
	);

	function getTelephoneHref(input?: string): string {
		if (!input) return '';
		return `tel:${input.replace(/[^\d+]/g, '')}`;
	}
</script>

<section id="contact" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-3 gap-12">
			<div class="animate-on-scroll animate-fade-up">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">
					{contactHeading}
				</h3>

				<div class="space-y-4">
					{#if phone}
						<a
							href={getTelephoneHref(phone)}
							class="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
						>
							<Phone size={20} strokeWidth={1.75} />
							<span>{phone}</span>
						</a>
					{/if}

					{#if email}
						<a
							href={`mailto:${email}`}
							class="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
						>
							<Mail size={20} strokeWidth={1.75} />
							<span>{email}</span>
						</a>
					{/if}

					{#if fullAddress}
						<div class="flex items-start gap-3 text-gray-400">
							<MapPin size={20} strokeWidth={1.75} class="flex-shrink-0 mt-1" />
							<span>{fullAddress}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="animate-on-scroll animate-fade-up" style="animation-delay: 100ms">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">
					{hoursHeading}
				</h3>

				<div class="space-y-3">
					{#each hours as hour}
						<div class="flex justify-between text-sm">
							<span class="text-gray-400">{hour.days}</span>
							<span class="text-white">{hour.time}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="animate-on-scroll animate-fade-up" style="animation-delay: 200ms">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">
					{socialHeading}
				</h3>

				{#if Object.keys(social).length > 0}
					<div class="flex gap-4 mb-8">
						{#if social.linkedin}
							<a
								href={social.linkedin}
								target="_blank"
								rel="noopener"
								class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin size={16} strokeWidth={1.75} />
							</a>
						{/if}
						{#if social.facebook}
							<a
								href={social.facebook}
								target="_blank"
								rel="noopener"
								class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								aria-label="Facebook"
							>
								<Facebook size={16} strokeWidth={1.75} />
							</a>
						{/if}
						{#if social.instagram}
							<a
								href={social.instagram}
								target="_blank"
								rel="noopener"
								class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								aria-label="Instagram"
							>
								<Instagram size={16} strokeWidth={1.75} />
							</a>
						{/if}
						{#if social.twitter}
							<a
								href={social.twitter}
								target="_blank"
								rel="noopener"
								class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								aria-label="Twitter"
							>
								<Twitter size={16} strokeWidth={1.75} />
							</a>
						{/if}
					</div>
				{/if}

				<a
					href={`mailto:${email}`}
					class="inline-block w-full text-center px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
				>
					{messageButtonText}
				</a>
			</div>
		</div>
	</div>
</section>
