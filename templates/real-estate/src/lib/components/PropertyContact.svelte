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
		<div class="grid md:grid-cols-2 gap-12">
			<div class="animate-on-scroll animate-fade-left" style:transition-delay="0.1s;">
				<form class="space-y-6">
					<div>
						<label class="block text-white text-xs tracking-wider uppercase mb-2">Full Name</label>
						<input
							type="text"
							class="w-full bg-transparent border border-[var(--color-border)] px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors"
							placeholder="Your Name"
						/>
					</div>
					<div>
						<label class="block text-white text-xs tracking-wider uppercase mb-2">Email</label>
						<input
							type="email"
							class="w-full bg-transparent border border-[var(--color-border)] px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors"
							placeholder="your@email.com"
						/>
					</div>
					<div>
						<label class="block text-white text-xs tracking-wider uppercase mb-2">Phone</label>
						<input
							type="tel"
							class="w-full bg-transparent border border-[var(--color-border)] px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors"
							placeholder="+1 (555) 123-4567"
						/>
					</div>
					<div>
						<label class="block text-white text-xs tracking-wider uppercase mb-2">Message</label>
						<textarea
							rows="4"
							class="w-full bg-transparent border border-[var(--color-border)] px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors resize-none"
							placeholder="I am interested in scheduling a private viewing..."
						></textarea>
					</div>
					<button
						type="submit"
						class="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 text-sm tracking-wider uppercase font-medium hover:bg-[var(--color-secondary)] transition-all duration-300"
					>
						Submit Inquiry
					</button>
				</form>
			</div>
			<div class="animate-on-scroll animate-fade-right" style:transition-delay="0.2s;">
				<div class="mb-8">
					<p class="text-[var(--color-primary)] text-xs tracking-wider uppercase mb-4">Contact Details</p>
					<div class="space-y-4">
						<div>
							<p class="text-white text-sm">Email</p>
							<p class="text-gray-400">{email}</p>
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
								>
									IG
								</a>
							{/if}
							{#if social.linkedin}
								<a
									href={social.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								>
									LI
								</a>
							{/if}
							{#if social.facebook}
								<a
									href={social.facebook}
									target="_blank"
									rel="noopener noreferrer"
									class="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
								>
									FB
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
