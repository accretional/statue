<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Props
	export let src: string; // Audio file path
	export let loop = true; // Loop the audio
	export let volume = 0.3; // Default volume (0-1)
	export let startPlaying = false; // Whether to start playing by default

	let audio: HTMLAudioElement;
	let isPlaying = false;

	function togglePlay() {
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			isPlaying = false;
		} else {
			audio
				.play()
				.then(() => {
					isPlaying = true;
				})
				.catch((err) => {
					console.error('Error playing audio', err);
					isPlaying = false;
				});
		}
	}

	onMount(() => {
		if (audio) {
			audio.volume = volume;
			if (startPlaying) {
				audio
					.play()
					.then(() => {
						isPlaying = true;
					})
					.catch(() => {
						// Autoplay blocked by browser
						isPlaying = false;
					});
			}
		}
	});

	onDestroy(() => {
		if (audio) {
			audio.pause();
		}
	});
</script>

<button class="bg-audio" on:click={togglePlay} aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
	<div class="bg-audio__icon">
		{#if isPlaying}
			<svg class="speaker" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M11 5L6 9H2v6h4l5 4V5z" />
				<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
			</svg>
		{:else}
			<svg class="speaker speaker--muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M11 5L6 9H2v6h4l5 4V5z" />
				<line x1="23" y1="9" x2="17" y2="15" />
				<line x1="17" y1="9" x2="23" y2="15" />
			</svg>
		{/if}
	</div>

	{#if isPlaying}
		<div class="bg-audio__visualizer">
			<div class="bar" />
			<div class="bar" />
			<div class="bar" />
		</div>
	{/if}
</button>

<audio bind:this={audio} {src} {loop} preload="auto">
	Your browser does not support the audio element.
</audio>

<style>
	.bg-audio {
		position: fixed;
		bottom: 1.5rem;
		left: 1.5rem;
		z-index: 1000;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		border: 1px solid var(--color-border);
		background: var(--color-card);
		color: var(--color-foreground);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		padding: 0;
	}

	.bg-audio:hover {
		background: var(--color-border);
		transform: scale(1.05);
	}

	.bg-audio__icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.speaker {
		width: 1.5rem;
		height: 1.5rem;
		display: block;
		color: var(--color-foreground);
		animation: pulse 2s ease-in-out infinite;
	}

	.speaker--muted {
		opacity: 0.5;
		animation: none;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.bg-audio__visualizer {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 12px;
	}

	.bar {
		width: 3px;
		border-radius: 999px;
		background: var(--color-primary);
		height: 3px;
		animation: bounce 0.6s ease-in-out infinite;
	}

	.bar:nth-child(1) {
		animation-delay: 0s;
	}

	.bar:nth-child(2) {
		animation-delay: 0.1s;
	}

	.bar:nth-child(3) {
		animation-delay: 0.2s;
	}

	@keyframes bounce {
		0%,
		100% {
			height: 3px;
		}
		50% {
			height: 12px;
		}
	}

	@media (max-width: 640px) {
		.bg-audio {
			bottom: 1rem;
			left: 1rem;
			width: 3rem;
			height: 3rem;
		}

		.speaker {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
