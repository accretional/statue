<script lang="ts">
	import { onMount } from 'svelte';

	export interface OpenHouseEvent {
		date: string; // ISO date string e.g. "2025-02-01"
		startTime: string; // e.g. "11:00"
		endTime: string; // e.g. "13:00"
	}

	export interface PropertyOpenHouseProps {
		subtitle?: string;
		title?: string;
		events?: OpenHouseEvent[];
		location?: string;
		description?: string;
		calendlyUrl?: string;
	}

	let {
		subtitle = 'Schedule a Visit',
		title = 'Open House',
		events = [
			{ date: '2025-02-01', startTime: '11:00', endTime: '13:00' },
			{ date: '2025-02-08', startTime: '14:00', endTime: '16:00' }
		],
		location = '123 Luxury Lane, San Francisco, CA 94102',
		description = 'Open House - Villa Meridian',
		calendlyUrl = undefined
	}: PropertyOpenHouseProps = $props();

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
SUMMARY:${description}
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
			text: description,
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
		// Check if mobile device
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile) {
			// On mobile, download ICS file which will open native calendar
			downloadICS(event);
		} else {
			// On desktop, show options
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

<section id="open-house" class="py-32 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-12 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			{#each events as event, index}
				<div
					class="animate-on-scroll animate-fade-up"
					style:transition-delay="{index * 0.1}s"
				>
					<div class="border border-[var(--color-border)] p-8 hover:border-[var(--color-primary)] transition-colors duration-300 relative">
						<p class="text-white text-xl font-light mb-2">{formatDate(event.date)}</p>
						<p class="text-gray-400 text-lg mb-6">
							{formatTime(event.startTime)} - {formatTime(event.endTime)}
						</p>

						<button
							type="button"
							onclick={() => handleAddToCalendar(event)}
							class="text-[var(--color-primary)] text-sm tracking-wide hover:underline underline-offset-4 transition-all flex items-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Add to calendar
						</button>

						<!-- Calendar Options Dropdown -->
						{#if activeEventIndex === index}
							<div class="absolute left-0 right-0 top-full mt-2 bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl z-10 animate-fade-in">
								<button
									type="button"
									onclick={() => openGoogleCalendar(event)}
									class="w-full px-4 py-3 text-left text-gray-300 hover:bg-[var(--color-border)] hover:text-white transition-colors flex items-center gap-3"
								>
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
										<path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-6 13.5h-3v-3h3v3zm0-4.5h-3V9h3v3z"/>
									</svg>
									Google Calendar
								</button>
								<button
									type="button"
									onclick={() => downloadAppleCalendar(event)}
									class="w-full px-4 py-3 text-left text-gray-300 hover:bg-[var(--color-border)] hover:text-white transition-colors flex items-center gap-3"
								>
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/>
									</svg>
									Apple Calendar / Other
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Calendly Embed -->
		{#if calendlyUrl}
			<div class="mt-16 animate-on-scroll animate-fade-up">
				<div class="text-center mb-8">
					<p class="text-white text-lg font-light mb-2">Can't make it to an open house?</p>
					<p class="text-gray-400 text-sm">Schedule a private showing at your convenience</p>
				</div>
				<div class="calendly-inline-widget" data-url={calendlyUrl} style="min-width:320px;height:700px;"></div>
			</div>
		{/if}
	</div>
</section>

<!-- Click outside to close dropdown -->
<svelte:window onclick={(e) => {
	const target = e.target as HTMLElement;
	if (!target.closest('#open-house button')) {
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
</style>
