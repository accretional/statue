<script lang="ts">
	import { onMount } from 'svelte';

	export interface OpenHouseEvent {
		date: string;
		startTime: string;
		endTime: string;
	}

	export interface AgentSocial {
		linkedin?: string;
		instagram?: string;
		facebook?: string;
	}

	export interface ContactSocial {
		instagram?: string;
		linkedin?: string;
		facebook?: string;
		pinterest?: string;
		twitter?: string;
		youtube?: string;
	}

	export interface PropertyContactSectionProps {
		subtitle?: string;
		title?: string;

		// Agent info
		agentName?: string;
		agentTitle?: string;
		agentImage?: string;
		agentBio?: string;
		agentPhone?: string;
		agentEmail?: string;
		specialties?: string[];
		agentSocial?: AgentSocial;

		// Open House
		openHouseEnabled?: boolean;
		openHouseTitle?: string;
		events?: OpenHouseEvent[];
		location?: string;
		eventDescription?: string;
		calendlyUrl?: string;

		// Contact info
		email?: string;
		phone?: string;
		address?: {
			street: string;
			city: string;
			state: string;
			zipCode: string;
			country: string;
		};
		social?: ContactSocial;
	}

	let {
		subtitle = 'Get In Touch',
		title = 'Contact & Schedule',

		agentName = 'Sarah Mitchell',
		agentTitle = 'Luxury Real Estate Specialist',
		agentImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
		agentBio = 'With over 15 years of experience in luxury real estate, Sarah specializes in helping discerning clients find their dream properties.',
		agentPhone = '+1 (555) 987-6543',
		agentEmail = 'agent@example.com',
		specialties = [
			'Luxury Properties',
			'Investment Advisory',
			'Market Analysis',
			'Private Showings'
		],
		agentSocial = {},

		openHouseEnabled = true,
		openHouseTitle = 'Open House',
		events = [
			{ date: '2025-02-01', startTime: '11:00', endTime: '13:00' },
			{ date: '2025-02-08', startTime: '14:00', endTime: '16:00' }
		],
		location = '123 Luxury Lane, San Francisco, CA 94102',
		eventDescription = 'Open House - Villa Meridian',
		calendlyUrl = undefined,

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
	}: PropertyContactSectionProps = $props();

	// Load Calendly script if URL is provided
	onMount(() => {
		if (calendlyUrl && !document.querySelector('script[src*="calendly"]')) {
			const script = document.createElement('script');
			script.src = 'https://assets.calendly.com/assets/external/widget.js';
			script.async = true;
			document.head.appendChild(script);
		}
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12;
		return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
	}

	function formatDateForICS(dateStr: string, time: string): string {
		const [year, month, day] = dateStr.split('-');
		const [hours, minutes] = time.split(':');
		return `${year}${month}${day}T${hours}${minutes}00`;
	}

	function generateICSContent(event: OpenHouseEvent): string {
		const startDateTime = formatDateForICS(event.date, event.startTime);
		const endDateTime = formatDateForICS(event.date, event.endTime);
		const uid = `openhouse-${event.date}-${event.startTime}@villameridian.com`;

		return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Villa Meridian//Open House//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${startDateTime}
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${eventDescription}
LOCATION:${location}
DESCRIPTION:You are invited to an exclusive open house viewing.
END:VEVENT
END:VCALENDAR`;
	}

	function generateGoogleCalendarUrl(event: OpenHouseEvent): string {
		const startDateTime = formatDateForICS(event.date, event.startTime);
		const endDateTime = formatDateForICS(event.date, event.endTime);

		const params = new URLSearchParams({
			action: 'TEMPLATE',
			text: eventDescription,
			dates: `${startDateTime}/${endDateTime}`,
			location: location,
			details: 'You are invited to an exclusive open house viewing.'
		});

		return `https://calendar.google.com/calendar/render?${params.toString()}`;
	}

	function downloadICS(event: OpenHouseEvent) {
		const icsContent = generateICSContent(event);
		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `open-house-${event.date}.ics`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function handleAddToCalendar(event: OpenHouseEvent) {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (isMobile) {
			downloadICS(event);
		} else {
			showCalendarOptions(event);
		}
	}

	let activeEventIndex = $state<number | null>(null);

	function showCalendarOptions(event: OpenHouseEvent) {
		const eventIndex = events.indexOf(event);
		activeEventIndex = activeEventIndex === eventIndex ? null : eventIndex;
	}

	function openGoogleCalendar(event: OpenHouseEvent) {
		window.open(generateGoogleCalendarUrl(event), '_blank');
		activeEventIndex = null;
	}

	function downloadAppleCalendar(event: OpenHouseEvent) {
		downloadICS(event);
		activeEventIndex = null;
	}
</script>

<section id="contact" class="py-32 px-4 bg-gradient-to-b from-[var(--color-background)] to-black/50">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-12">
			<!-- Agent Column -->
			<div class="animate-on-scroll animate-fade-up">
				<div class="mb-6">
					<div class="relative aspect-square overflow-hidden rounded-lg shadow-2xl mb-6">
						<img src={agentImage} alt={agentName} class="w-full h-full object-cover" />
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
					</div>
					<h3 class="text-2xl font-light text-white mb-2">{agentName}</h3>
					<p class="text-[var(--color-primary)] text-sm tracking-wide mb-4">{agentTitle}</p>
					<p class="text-gray-400 text-sm leading-relaxed mb-6">{agentBio}</p>

					<!-- Specialties -->
					{#if specialties.length > 0}
						<div class="mb-6">
							<p class="text-white text-xs font-medium uppercase tracking-wider mb-3">Specialties</p>
							<div class="space-y-2">
								{#each specialties as specialty}
									<div class="flex items-center gap-2">
										<span class="text-[var(--color-primary)] text-sm">◆</span>
										<span class="text-gray-300 text-sm">{specialty}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Agent Contact -->
					<div class="space-y-3 mb-6">
						{#if agentPhone}
							<a href="tel:{agentPhone}" class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors text-sm">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
								</svg>
								{agentPhone}
							</a>
						{/if}
						{#if agentEmail}
							<a href="mailto:{agentEmail}" class="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)] transition-colors text-sm">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect width="20" height="16" x="2" y="4" rx="2"></rect>
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
								</svg>
								{agentEmail}
							</a>
						{/if}
					</div>

					<!-- Agent Social -->
					{#if Object.keys(agentSocial).length > 0}
						<div class="flex gap-3">
							{#if agentSocial.linkedin}
								<a href={agentSocial.linkedin} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="LinkedIn">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
										<rect width="4" height="12" x="2" y="9"></rect>
										<circle cx="4" cy="4" r="2"></circle>
									</svg>
								</a>
							{/if}
							{#if agentSocial.instagram}
								<a href={agentSocial.instagram} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Instagram">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
										<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
									</svg>
								</a>
							{/if}
							{#if agentSocial.facebook}
								<a href={agentSocial.facebook} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Facebook">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
									</svg>
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Open House Column -->
			{#if openHouseEnabled && events.length > 0}
				<div class="animate-on-scroll animate-fade-up" style:transition-delay="0.1s">
					<h3 class="text-xl font-light text-white mb-6">{openHouseTitle}</h3>
					<div class="space-y-4">
						{#each events as event, index}
							<div class="border border-[var(--color-border)] p-6 hover:border-[var(--color-primary)] transition-colors duration-300 relative">
								<p class="text-white text-lg font-light mb-1">{formatDate(event.date)}</p>
								<p class="text-gray-400 mb-4">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>

								<button type="button" onclick={() => handleAddToCalendar(event)} class="text-[var(--color-primary)] text-sm tracking-wide hover:underline underline-offset-4 transition-all flex items-center gap-2">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									Add to calendar
								</button>

								{#if activeEventIndex === index}
									<div class="absolute left-0 right-0 top-full mt-2 bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl z-10 animate-fade-in">
										<button type="button" onclick={() => openGoogleCalendar(event)} class="w-full px-4 py-3 text-left text-gray-300 hover:bg-[var(--color-border)] hover:text-white transition-colors flex items-center gap-3">
											<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
												<path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-6 13.5h-3v-3h3v3zm0-4.5h-3V9h3v3z"/>
											</svg>
											Google Calendar
										</button>
										<button type="button" onclick={() => downloadAppleCalendar(event)} class="w-full px-4 py-3 text-left text-gray-300 hover:bg-[var(--color-border)] hover:text-white transition-colors flex items-center gap-3">
											<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
												<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/>
											</svg>
											Apple Calendar / Other
										</button>
									</div>
								{/if}
							</div>
						{/each}
					</div>

					{#if calendlyUrl}
						<div class="mt-8">
							<p class="text-white text-sm font-light mb-2">Can't make it to an open house?</p>
							<p class="text-gray-400 text-xs mb-4">Schedule a private showing</p>
							<div class="calendly-inline-widget" data-url={calendlyUrl} style="min-width:280px;height:500px;"></div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Contact Info Column -->
			<div class="animate-on-scroll animate-fade-up" style:transition-delay="0.2s">
				<h3 class="text-xl font-light text-white mb-6">Property Contact</h3>
				<div class="space-y-6">
					<div>
						<p class="text-white text-sm mb-1">Email</p>
						<a href="mailto:{email}" class="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">{email}</a>
					</div>
					<div>
						<p class="text-white text-sm mb-1">Phone</p>
						<p class="text-gray-400 text-sm">{phone}</p>
					</div>
					<div>
						<p class="text-white text-sm mb-1">Address</p>
						<p class="text-gray-400 text-sm">
							{address.street}<br />
							{address.city}, {address.state} {address.zipCode}
						</p>
					</div>

					{#if Object.keys(social).length > 0}
						<div>
							<p class="text-white text-sm mb-3">Follow Us</p>
							<div class="flex gap-3 flex-wrap">
								{#if social.instagram}
									<a href={social.instagram} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Instagram">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
											<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
											<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
										</svg>
									</a>
								{/if}
								{#if social.linkedin}
									<a href={social.linkedin} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="LinkedIn">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
											<rect width="4" height="12" x="2" y="9"></rect>
											<circle cx="4" cy="4" r="2"></circle>
										</svg>
									</a>
								{/if}
								{#if social.facebook}
									<a href={social.facebook} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Facebook">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
										</svg>
									</a>
								{/if}
								{#if social.pinterest}
									<a href={social.pinterest} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Pinterest">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path>
											<path d="M12 2v20"></path>
											<path d="M8 8a4 4 0 0 1 8 0c0 1.5-1 2.5-2 3.5"></path>
										</svg>
									</a>
								{/if}
								{#if social.twitter}
									<a href={social.twitter} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="Twitter">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
										</svg>
									</a>
								{/if}
								{#if social.youtube}
									<a href={social.youtube} target="_blank" rel="noopener noreferrer" class="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors" aria-label="YouTube">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
	</div>
</section>

<!-- Click outside to close dropdown -->
<svelte:window onclick={(e) => {
	const target = e.target as HTMLElement;
	if (!target.closest('#contact button')) {
		activeEventIndex = null;
	}
}} />

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-fade-in) {
		animation: fade-in 0.2s ease-out;
	}

	:global(section#contact) {
		position: relative;
	}
</style>
