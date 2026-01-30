<script lang="ts">
	export interface AgentSocial {
		linkedin?: string;
		instagram?: string;
		facebook?: string;
	}

	export interface PropertyAgentProps {
		subtitle?: string;
		title?: string;
		agentName?: string;
		agentTitle?: string;
		agentImage?: string;
		agentBio?: string;
		agentPhone?: string;
		agentEmail?: string;
		specialties?: string[];
		social?: AgentSocial;
	}

	let {
		subtitle = 'Your Expert Guide',
		title = 'Meet Your Real Estate Agent',
		agentName = 'Sarah Mitchell',
		agentTitle = 'Luxury Real Estate Specialist',
		agentImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
		agentBio = 'With over 15 years of experience in luxury real estate, Sarah specializes in helping discerning clients find their dream properties. Her expertise, market knowledge, and dedication to exceptional service have earned her recognition as one of the top agents in the region.',
		agentPhone = '+1 (555) 987-6543',
		agentEmail = 'agent@example.com',
		specialties = [
			'Luxury Properties',
			'Investment Advisory',
			'Market Analysis',
			'Private Showings'
		],
		social = {
			linkedin: 'https://linkedin.com',
			instagram: 'https://instagram.com',
			facebook: 'https://facebook.com'
		}
	}: PropertyAgentProps = $props();
</script>

<section id="agent" class="py-32 px-4 bg-gradient-to-b from-[var(--color-background)] to-black/50">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-12 items-center">
			<!-- Agent Image -->
			<div class="md:col-span-1 animate-on-scroll animate-fade-left">
				<div class="relative aspect-square overflow-hidden rounded-lg shadow-2xl">
					<img src={agentImage} alt={agentName} class="w-full h-full object-cover" />
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"
					/>
				</div>
			</div>

			<!-- Agent Information -->
			<div class="md:col-span-2 animate-on-scroll animate-fade-right">
				<div class="space-y-6">
					<!-- Name and Title -->
					<div>
						<h3 class="text-3xl md:text-4xl font-light text-white mb-2">{agentName}</h3>
						<p class="text-[var(--color-primary)] text-lg tracking-wide">{agentTitle}</p>
					</div>

					<!-- Bio -->
					<p class="text-gray-400 text-lg leading-relaxed">{agentBio}</p>

					<!-- Specialties -->
					<div>
						<p class="text-white text-sm font-medium uppercase tracking-wider mb-4">
							Specialties
						</p>
						<div class="grid grid-cols-2 gap-3">
							{#each specialties as specialty}
								<div class="flex items-center gap-3">
									<span class="text-[var(--color-primary)] text-lg">◆</span>
									<span class="text-gray-300">{specialty}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Contact Info -->
					<div class="flex flex-wrap gap-6 pt-4">
						{#if agentPhone}
							<a
								href="tel:{agentPhone}"
								class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
								</svg>
								<span class="text-sm">{agentPhone}</span>
							</a>
						{/if}
						{#if agentEmail}
							<a
								href="mailto:{agentEmail}"
								class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect width="20" height="16" x="2" y="4" rx="2"></rect>
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
								</svg>
								<span class="text-sm">{agentEmail}</span>
							</a>
						{/if}
					</div>

					<!-- Social Links -->
					<div class="flex gap-4 pt-4">
						{#if social?.linkedin}
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
						{#if social?.instagram}
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
						{#if social?.facebook}
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
					</div>

				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(section#agent) {
		position: relative;
	}
</style>
