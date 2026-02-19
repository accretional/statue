<script lang="ts">
	export interface BrokerageContactProps {
		subtitle?: string;
		title?: string;
		description?: string;
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
		subtitle = 'Contact Us',
		title = 'Get In Touch',
		description = 'Ready to start your real estate journey? Our team is here to help.',
		phone = '+1 (650) 555-0100',
		email = 'info@prestigerealty.com',
		address = {
			street: '100 University Avenue, Suite 500',
			city: 'Palo Alto',
			state: 'CA',
			zipCode: '94301'
		},
		hours = [
			{ days: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
			{ days: 'Saturday', time: '10:00 AM - 4:00 PM' },
			{ days: 'Sunday', time: 'By Appointment' }
		],
		social = {}
	}: BrokerageContactProps = $props();

	let fullAddress = $derived(
		[address?.street, address?.city, address?.state, address?.zipCode]
			.filter(Boolean)
			.join(', ')
	);
</script>

<section id="contact" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-3 gap-12">
			<!-- Contact Info -->
			<div class="animate-on-scroll animate-fade-up">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">Contact Information</h3>

				<div class="space-y-4">
					{#if phone}
						<a href="tel:{phone}" class="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
							</svg>
							<span>{phone}</span>
						</a>
					{/if}

					{#if email}
						<a href="mailto:{email}" class="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
								<polyline points="22,6 12,13 2,6"></polyline>
							</svg>
							<span>{email}</span>
						</a>
					{/if}

					{#if fullAddress}
						<div class="flex items-start gap-3 text-gray-400">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="flex-shrink-0 mt-1">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>{fullAddress}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Office Hours -->
			<div class="animate-on-scroll animate-fade-up" style="animation-delay: 100ms">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">Office Hours</h3>

				<div class="space-y-3">
					{#each hours as hour}
						<div class="flex justify-between text-sm">
							<span class="text-gray-400">{hour.days}</span>
							<span class="text-white">{hour.time}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Social & CTA -->
			<div class="animate-on-scroll animate-fade-up" style="animation-delay: 200ms">
				<h3 class="text-white text-lg mb-6 pb-2 border-b border-[var(--color-border)]">Connect With Us</h3>

				{#if Object.keys(social).length > 0}
					<div class="flex gap-4 mb-8">
						{#if social.linkedin}
							<a href={social.linkedin} target="_blank" rel="noopener" class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
								<span class="text-sm">in</span>
							</a>
						{/if}
						{#if social.facebook}
							<a href={social.facebook} target="_blank" rel="noopener" class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
								<span class="text-sm">f</span>
							</a>
						{/if}
						{#if social.instagram}
							<a href={social.instagram} target="_blank" rel="noopener" class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
								<span class="text-sm">ig</span>
							</a>
						{/if}
						{#if social.twitter}
							<a href={social.twitter} target="_blank" rel="noopener" class="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
								<span class="text-sm">x</span>
							</a>
						{/if}
					</div>
				{/if}

				<a
					href="mailto:{email}"
					class="inline-block w-full text-center px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
				>
					Send Us a Message
				</a>
			</div>
		</div>
	</div>
</section>
