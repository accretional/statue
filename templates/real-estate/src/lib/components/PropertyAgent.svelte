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
		cta?: {
			text: string;
			url: string;
		};
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
		},
		cta = {
			text: 'Schedule Consultation',
			url: '#contact'
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
					<div class="flex flex-wrap gap-8 pt-4">
						{#if agentPhone}
							<a
								href="tel:{agentPhone}"
								class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors"
							>
								<span class="text-xl">📞</span>
								<span class="text-sm">{agentPhone}</span>
							</a>
						{/if}
						{#if agentEmail}
							<a
								href="mailto:{agentEmail}"
								class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors"
							>
								<span class="text-xl">✉</span>
								<span class="text-sm">{agentEmail}</span>
							</a>
						{/if}
					</div>

					<!-- Social Links -->
					<div class="flex gap-6 pt-4">
						{#if social?.linkedin}
							<a
								href={social.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
								aria-label="LinkedIn"
							>
								<span class="text-2xl">in</span>
							</a>
						{/if}
						{#if social?.instagram}
							<a
								href={social.instagram}
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
								aria-label="Instagram"
							>
								<span class="text-2xl">📷</span>
							</a>
						{/if}
						{#if social?.facebook}
							<a
								href={social.facebook}
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
								aria-label="Facebook"
							>
								<span class="text-2xl">f</span>
							</a>
						{/if}
					</div>

					<!-- CTA Button -->
					<div class="pt-6">
						<a
							href={cta.url}
							class="inline-block px-8 py-3 bg-[var(--color-primary)] text-black font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95"
						>
							{cta.text}
						</a>
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
