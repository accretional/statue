<script lang="ts">
	import { onMount } from 'svelte';

	export interface AgentContactProps {
		subtitle?: string;
		title?: string;
		description?: string;
		name?: string;
		phone?: string;
		email?: string;
		address?: {
			street?: string;
			city?: string;
			state?: string;
			zipCode?: string;
		};
		social?: {
			linkedin?: string;
			facebook?: string;
			instagram?: string;
			twitter?: string;
		};
		calendlyUrl?: string;
	}

	let {
		subtitle = 'Get In Touch',
		title = 'Let\'s Work Together',
		description = 'Ready to buy or sell? I\'m here to help you every step of the way.',
		name = 'Sarah Mitchell',
		phone = '+1 (555) 123-4567',
		email = 'sarah@example.com',
		address = {},
		social = {},
		calendlyUrl = ''
	}: AgentContactProps = $props();

	let trimmedCalendlyUrl = $derived((calendlyUrl || '').trim());

	function openCalendlyModal() {
		if (trimmedCalendlyUrl && typeof window !== 'undefined' && (window as any).Calendly) {
			(window as any).Calendly.initPopupWidget({ url: trimmedCalendlyUrl });
		}
	}

	onMount(() => {
		if (trimmedCalendlyUrl && typeof window !== 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://assets.calendly.com/assets/external/widget.js';
			script.async = true;
			document.body.appendChild(script);

			const link = document.createElement('link');
			link.href = 'https://assets.calendly.com/assets/external/widget.css';
			link.rel = 'stylesheet';
			document.head.appendChild(link);
		}
	});
</script>

<section id="contact" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 gap-12">
			<!-- Contact Info -->
			<div class="animate-on-scroll animate-fade-right">
				<div class="space-y-8">
					<!-- Phone -->
					<div class="flex items-start gap-4">
						<div class="text-[var(--color-primary)] mt-1">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
							</svg>
						</div>
						<div>
							<p class="text-gray-400 text-sm mb-1">Phone</p>
							<a href="tel:{phone}" class="text-white hover:text-[var(--color-primary)] transition-colors">
								{phone}
							</a>
						</div>
					</div>

					<!-- Email -->
					<div class="flex items-start gap-4">
						<div class="text-[var(--color-primary)] mt-1">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
								<polyline points="22,6 12,13 2,6"></polyline>
							</svg>
						</div>
						<div>
							<p class="text-gray-400 text-sm mb-1">Email</p>
							<a href="mailto:{email}" class="text-white hover:text-[var(--color-primary)] transition-colors break-all">
								{email}
							</a>
						</div>
					</div>

					<!-- Address -->
					{#if address.street}
						<div class="flex items-start gap-4">
							<div class="text-[var(--color-primary)] mt-1">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
							</div>
							<div>
								<p class="text-gray-400 text-sm mb-1">Office</p>
								<p class="text-white">
									{address.street}<br />
									{address.city}, {address.state} {address.zipCode}
								</p>
							</div>
						</div>
					{/if}

					<!-- Social Links -->
					{#if Object.keys(social).length > 0}
						<div class="flex items-start gap-4">
							<div class="text-[var(--color-primary)] mt-1">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="18" cy="5" r="3"></circle>
									<circle cx="6" cy="12" r="3"></circle>
									<circle cx="18" cy="19" r="3"></circle>
									<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
									<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
								</svg>
							</div>
							<div>
								<p class="text-gray-400 text-sm mb-2">Connect</p>
								<div class="flex gap-4">
									{#if social.linkedin}
										<a href={social.linkedin} target="_blank" rel="noopener" class="text-white hover:text-[var(--color-primary)] transition-colors">
											LinkedIn
										</a>
									{/if}
									{#if social.facebook}
										<a href={social.facebook} target="_blank" rel="noopener" class="text-white hover:text-[var(--color-primary)] transition-colors">
											Facebook
										</a>
									{/if}
									{#if social.instagram}
										<a href={social.instagram} target="_blank" rel="noopener" class="text-white hover:text-[var(--color-primary)] transition-colors">
											Instagram
										</a>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- CTA Box -->
			<div class="animate-on-scroll animate-fade-left">
				<div class="p-8 bg-[var(--color-card)] border border-[var(--color-border)]">
					<h3 class="text-white text-xl font-light mb-4">Schedule a Consultation</h3>
					<p class="text-gray-400 mb-6">
						Let's discuss your real estate goals. Book a free consultation to get started.
					</p>

						{#if trimmedCalendlyUrl}
							<button
								onclick={openCalendlyModal}
								class="cursor-pointer w-full px-6 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase mb-4"
						>
							Schedule Now
						</button>
					{/if}

					<div class="space-y-3">
						<a
							href="tel:{phone}"
							class="cursor-pointer block w-full px-6 py-3 border border-[var(--color-border)] text-white hover:bg-white/5 transition-colors duration-300 text-center text-sm tracking-wider uppercase"
						>
							Call Me
						</a>
						<a
							href="mailto:{email}"
							class="cursor-pointer block w-full px-6 py-3 border border-[var(--color-border)] text-white hover:bg-white/5 transition-colors duration-300 text-center text-sm tracking-wider uppercase"
						>
							Send Email
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
