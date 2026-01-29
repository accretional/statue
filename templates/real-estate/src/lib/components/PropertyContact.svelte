<script lang="ts">
	export interface PropertyContactProps {
		title?: string;
		subtitle?: string;
		description?: string;
		email?: string;
		phone?: string;
		address?: {
			street: string;
			city: string;
			state: string;
			zipCode: string;
			country: string;
		};
		social?: {
			instagram?: string;
			linkedin?: string;
			facebook?: string;
			pinterest?: string;
			twitter?: string;
			youtube?: string;
		};
	}

	let {
		title = 'Private Showing',
		subtitle = 'Contact',
		description = 'To schedule a private viewing or request additional information, please contact our estate team.',
		email = 'inquiry@example.com',
		phone = '+1 (555) 123-4567',
		address = {
			street: '123 Street',
			city: 'San Francisco',
			state: 'CA',
			zipCode: '94102',
			country: 'USA'
		},
		social = {}
	}: PropertyContactProps = $props();
</script>

<section id="contact" class="py-32 px-4 bg-[var(--color-card)]">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white mb-6">{title}</h2>
			<p class="text-gray-400 text-lg">{description}</p>
		</div>
		<div class="grid md:grid-cols-1 gap-12 max-w-2xl mx-auto">
			<div class="animate-on-scroll animate-fade-up" style:transition-delay="0.1s;">
				<div class="mb-8">
					<p class="text-[var(--color-primary)] text-xs tracking-wider uppercase mb-4">Contact Details</p>
					<div class="space-y-4">
						<div>
							<p class="text-white text-sm">Email</p>
							<a
								href="mailto:{email}"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
							>
								{email}
							</a>
						</div>
						<div>
							<p class="text-white text-sm">Phone</p>
							<p class="text-gray-400">{phone}</p>
						</div>
						<div>
							<p class="text-white text-sm">Address</p>
							<p class="text-gray-400">
								{address.street}<br />
								{address.city}, {address.state} {address.zipCode}
							</p>
						</div>
					</div>
				</div>
				{#if Object.keys(social).length > 0}
					<div>
						<p class="text-[var(--color-primary)] text-xs tracking-wider uppercase mb-4">Follow Us</p>
						<div class="flex gap-4">
							{#if social.instagram}
								<a
									href={social.instagram}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="Instagram"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
										<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
									</svg>
								</a>
							{/if}
							{#if social.linkedin}
								<a
									href={social.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="LinkedIn"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
										<rect width="4" height="12" x="2" y="9"></rect>
										<circle cx="4" cy="4" r="2"></circle>
									</svg>
								</a>
							{/if}
							{#if social.facebook}
								<a
									href={social.facebook}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="Facebook"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
									</svg>
								</a>
							{/if}
							{#if social.pinterest}
								<a
									href={social.pinterest}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="Pinterest"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path>
										<path d="M12 2v20"></path>
										<path d="M8 8a4 4 0 0 1 8 0c0 1.5-1 2.5-2 3.5"></path>
									</svg>
								</a>
							{/if}
							{#if social.twitter}
								<a
									href={social.twitter}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="Twitter"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
									</svg>
								</a>
							{/if}
							{#if social.youtube}
								<a
									href={social.youtube}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
									aria-label="YouTube"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
										<polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
									</svg>
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
