<script lang="ts">
	import { onMount } from 'svelte';

	export type Track = {
		src: string;
		title: string;
		artist?: string;
		type?: string;   // optional – we can infer it from src
		cover?: string;  // optional – album art URL or data URL extracted from MP3 metadata
	};

	// Props
	export let tracks: Track[] = [];
	export let initialIndex = 0;

	// Extra props for "advanced" behavior
	// storageKey lets different pages use different save slots
	export let storageKey = 'statue-music-player';
	export let autoResume = true; // continue from last position if true

	// Playlist display options
	export let enableScroll = true; // Enable scrolling for long playlists
	export let scrollThreshold = 5; // Number of tracks before scrolling is enabled
	export let maxPlaylistHeight = '300px'; // Max height when scrolling is enabled
	export let enablePagination = false; // Enable pagination instead of scrolling
	export let itemsPerPage = 10; // Tracks per page when pagination is enabled

	let audio: HTMLAudioElement;
	let currentIndex = initialIndex;
	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;
	let isSeeking = false;
	let hasLoadedOnce = false;

	// throttle saving to localStorage
	let lastSavedTime = 0;

	// pagination state
	let currentPage = 0;

	// derived state
	$: hasTracks = tracks && tracks.length > 0;
	$: currentTrack = hasTracks ? tracks[currentIndex] : null;
	$: currentMimeType = currentTrack ? resolveMimeType(currentTrack) : null;
	$: shouldEnableScroll = enableScroll && tracks.length > scrollThreshold;
	$: totalPages = enablePagination ? Math.ceil(tracks.length / itemsPerPage) : 1;
	$: displayedTracks = enablePagination
		? tracks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
		: tracks;
	$: playlistStyle = shouldEnableScroll && !enablePagination
		? `max-height: ${maxPlaylistHeight}; overflow-y: auto;`
		: '';

	function formatTime(seconds: number) {
		if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60)
			.toString()
			.padStart(2, '0');
		return `${mins}:${secs}`;
	}

	function resolveMimeType(track: Track): string {
		if (track.type) return track.type;

		const lower = track.src.toLowerCase();
		if (lower.endsWith('.wav') || lower.endsWith('.wave')) return 'audio/wav';
		if (lower.endsWith('.ogg') || lower.endsWith('.oga')) return 'audio/ogg';
		if (lower.endsWith('.aac')) return 'audio/aac';
		if (lower.endsWith('.flac')) return 'audio/flac';

		// default to mp3-style
		return 'audio/mpeg';
	}

	function formatFromMime(mime: string | null): string {
		if (!mime) return '';
		const parts = mime.split('/');
		return parts[1]?.toUpperCase() ?? mime.toUpperCase();
	}

	function togglePlay() {
		if (!audio || !currentTrack) return;

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

	function handleLoadedMetadata() {
		if (!audio) return;
		duration = audio.duration || 0;
		hasLoadedOnce = true;
	}

	function handleTimeUpdate() {
		if (!audio || isSeeking) return;
		currentTime = audio.currentTime || 0;

		// Save every ~2 seconds so we can resume
		const now = performance.now();
		if (now - lastSavedTime > 2000) {
			savePlaybackState();
			lastSavedTime = now;
		}
	}

	function handleSeekInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);
		isSeeking = true;
		currentTime = value;
	}

	function handleSeekChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);
		if (!audio) return;
		audio.currentTime = value;
		currentTime = value;
		isSeeking = false;
		savePlaybackState();
	}

	function nextTrack() {
		if (!hasTracks) return;
		currentIndex = (currentIndex + 1) % tracks.length;
		switchTrack(true);
	}

	function prevTrack() {
		if (!hasTracks) return;
		currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
		switchTrack(true);
	}

	function selectTrack(index: number) {
		if (index === currentIndex) return;
		if (!hasTracks) return;
		currentIndex = index;
		switchTrack(true);
	}

	function handleEnded() {
		// Auto-advance if there’s a playlist, otherwise just stop
		if (tracks.length > 1) {
			nextTrack();
		} else {
			isPlaying = false;
			currentTime = 0;
			savePlaybackState();
		}
	}

	function switchTrack(autoplay: boolean) {
		if (!audio || !currentTrack) return;
		isPlaying = false;
		currentTime = 0;
		duration = 0;
		audio.load();
		if (autoplay) {
			audio
				.play()
				.then(() => {
					isPlaying = true;
				})
				.catch(() => {
					isPlaying = false;
				});
		}
		savePlaybackState(); // store new currentIndex
	}

	function handleKeydown(event: KeyboardEvent) {
		// Provide keyboard shortcuts when the player is focused
		if (event.code === 'Space') {
			event.preventDefault();
			togglePlay();
		} else if (event.code === 'ArrowRight') {
			event.preventDefault();
			seekBy(5);
		} else if (event.code === 'ArrowLeft') {
			event.preventDefault();
			seekBy(-5);
		} else if (event.code === 'ArrowUp') {
			event.preventDefault();
			prevTrack();
		} else if (event.code === 'ArrowDown') {
			event.preventDefault();
			nextTrack();
		}
	}

	function seekBy(delta: number) {
		if (!audio || !hasLoadedOnce) return;
		const next = Math.min(Math.max(0, (audio.currentTime || 0) + delta), duration || 0);
		audio.currentTime = next;
		currentTime = next;
		savePlaybackState();
	}

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function goToPage(page: number) {
		if (page >= 0 && page < totalPages) {
			currentPage = page;
		}
	}

	// -------------------------------
	// Persistence: save / load state
	// -------------------------------
	type SavedState = {
		src: string;
		index: number;
		time: number;
	};

	function savePlaybackState() {
		if (!audio || !currentTrack) return;
		const state: SavedState = {
			src: currentTrack.src,
			index: currentIndex,
			time: audio.currentTime || 0
		};
		try {
			localStorage.setItem(storageKey, JSON.stringify(state));
		} catch {
			// ignore if storage is unavailable
		}
	}

	function loadPlaybackState() {
		if (!autoResume || !hasTracks) return;
		try {
			const raw = localStorage.getItem(storageKey);
			if (!raw) return;
			const state = JSON.parse(raw) as SavedState;
			const index = tracks.findIndex((t) => t.src === state.src);
			if (index === -1) return;
			currentIndex = index;
			const storedTime = state.time ?? 0;
			onTrackReadyToResume(storedTime);
		} catch {
			// ignore
		}
	}

	function onTrackReadyToResume(storedTime: number) {
		if (!audio || !storedTime) return;
		audio.currentTime = storedTime;
		currentTime = storedTime;
		if (autoResume) {
			audio
				.play()
				.then(() => {
					isPlaying = true;
				})
				.catch(() => {
					// autoplay might be blocked; leave paused
					isPlaying = false;
				});
		}
	}

	onMount(() => {
		// When the component mounts, attempt to restore last track/time
		loadPlaybackState();
		// ensure the audio element loads the right source the first time
		if (audio && currentTrack) {
			audio.load();
		}
	});
</script>

{#if !hasTracks}
	<div class="player player--empty">
		<p>No tracks provided to MusicPlayer.</p>
	</div>
{:else}
	<div
		class="player"
		tabindex="0"
		role="group"
		aria-label="Music player"
		on:keydown={handleKeydown}
	>
		<div class="player__left">
			{#if currentTrack?.cover}
				<div class="player__cover">
					<img src={currentTrack.cover} alt={currentTrack.title} />
				</div>
			{:else}
				<div class="player__cover player__cover--placeholder">
					<div class="player__vinyl">
						<div class="player__vinyl-center" />
					</div>
				</div>
			{/if}

			<!-- Simple visualizer that animates only while playing -->
			<div class="player__visualizer">
				<div class="bar {isPlaying ? 'bar--on' : ''}" />
				<div class="bar {isPlaying ? 'bar--on' : ''}" />
				<div class="bar {isPlaying ? 'bar--on' : ''}" />
				<div class="bar {isPlaying ? 'bar--on' : ''}" />
			</div>
		</div>

		<div class="player__right">
			<header class="player__header">
				<div class="player__titles">
					<h2 class="player__title">{currentTrack.title}</h2>
					{#if currentTrack.artist}
						<p class="player__artist">{currentTrack.artist}</p>
					{/if}
				</div>

				{#if tracks.length > 1}
					<p class="player__playlist-label">
						Track {currentIndex + 1} of {tracks.length}
					</p>
				{/if}
			</header>

			<div class="player__controls">
				<button
					class="player__btn"
					on:click={prevTrack}
					aria-label="Previous track"
					disabled={tracks.length < 2}
				>
					⏮
				</button>

				<button
					class="player__btn player__btn--primary"
					on:click={togglePlay}
					aria-label="Play or pause"
				>
					{#if isPlaying}
						⏸
					{:else}
						▶
					{/if}
				</button>

				<button
					class="player__btn"
					on:click={nextTrack}
					aria-label="Next track"
					disabled={tracks.length < 2}
				>
					⏭
				</button>
			</div>

			<div class="player__timeline">
				<span class="player__time">{formatTime(currentTime)}</span>
				<input
					type="range"
					min="0"
					max={duration || 0}
					step="0.1"
					value={currentTime}
					on:input={handleSeekInput}
					on:change={handleSeekChange}
				/>
				<span class="player__time">{formatTime(duration)}</span>
			</div>

			{#if tracks.length > 1}
				<ul class="player__playlist" style={playlistStyle} aria-label="Playlist">
					{#each displayedTracks as track, displayIndex}
						{@const actualIndex = enablePagination ? currentPage * itemsPerPage + displayIndex : displayIndex}
						<li
							class="player__playlist-item {actualIndex === currentIndex
								? 'player__playlist-item--active'
								: ''}"
						>
							<button
								type="button"
								on:click={() => selectTrack(actualIndex)}
								class="player__playlist-btn"
								aria-current={actualIndex === currentIndex ? 'true' : 'false'}
							>
								<span class="player__playlist-title">{track.title}</span>
								{#if track.artist}
									<span class="player__playlist-artist">{track.artist}</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>

				{#if enablePagination && totalPages > 1}
					<div class="player__pagination">
						<button
							class="player__pagination-btn"
							on:click={prevPage}
							disabled={currentPage === 0}
							aria-label="Previous page"
						>
							←
						</button>
						<span class="player__pagination-info">
							Page {currentPage + 1} of {totalPages}
						</span>
						<button
							class="player__pagination-btn"
							on:click={nextPage}
							disabled={currentPage === totalPages - 1}
							aria-label="Next page"
						>
							→
						</button>
					</div>
				{/if}
			{/if}
		</div>

		<audio
			bind:this={audio}
			on:loadedmetadata={handleLoadedMetadata}
			on:timeupdate={handleTimeUpdate}
			on:ended={handleEnded}
		>
			{#if currentTrack && currentMimeType}
				<source src={currentTrack.src} type={currentMimeType} />
			{/if}
			Your browser does not support the audio element.
		</audio>
	</div>
{/if}

<style>
	.player {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.5rem;
		padding: 1.5rem 1.75rem;
		border-radius: 1.5rem;
		background: var(--color-card);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		max-width: 42rem;
		margin: 1.75rem auto;
		outline: none;
	}

	.player:focus-visible {
		border-color: var(--color-primary);
	}

	.player--empty {
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 24rem;
		padding: 1rem 1.25rem;
		border-radius: 1.25rem;
		background: var(--color-card);
		color: var(--color-muted);
		border: 1px solid var(--color-border);
	}

	.player__left {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.player__cover {
		width: 84px;
		height: 84px;
		border-radius: 1rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
		position: relative;
	}

	.player__cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.player__cover--placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background);
	}

	.player__vinyl {
		width: 72px;
		height: 72px;
		border-radius: 999px;
		border: 3px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background);
	}

	.player__vinyl-center {
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: var(--color-accent);
		border: 2px solid var(--color-border);
	}

	.player__visualizer {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 22px;
	}

	.bar {
		width: 4px;
		border-radius: 999px;
		background: var(--color-border);
		height: 4px;
	}

	.bar--on:nth-child(1) {
		animation: bounce 0.7s ease-in-out infinite;
	}
	.bar--on:nth-child(2) {
		animation: bounce 0.7s ease-in-out infinite 0.1s;
	}
	.bar--on:nth-child(3) {
		animation: bounce 0.7s ease-in-out infinite 0.2s;
	}
	.bar--on:nth-child(4) {
		animation: bounce 0.7s ease-in-out infinite 0.3s;
	}

	@keyframes bounce {
		0%,
		100% {
			height: 4px;
		}
		50% {
			height: 18px;
		}
	}

	.player__right {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
	}

	.player__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.player__titles {
		min-width: 0;
	}

	.player__title {
		font-size: 1.05rem;
		font-weight: 600;
		margin: 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.player__artist {
		margin: 0.18rem 0 0;
		font-size: 0.85rem;
		color: var(--color-secondary);
	}

	.player__playlist-label {
		margin: 0;
		font-size: 0.78rem;
		color: var(--color-muted);
		white-space: nowrap;
	}

	.player__controls {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.player__btn {
		border: none;
		background: transparent;
		color: inherit;
		font-size: 1.1rem;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 999px;
		transition:
			background 0.15s ease,
			transform 0.15s ease,
			opacity 0.15s ease,
			box-shadow 0.15s ease;
	}

	.player__btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.player__btn:not(:disabled):hover {
		background: var(--color-border);
		transform: translateY(-1px);
	}

	.player__btn--primary {
		font-size: 1.4rem;
		background: var(--color-primary);
		color: var(--color-on-primary);
		width: 3rem;
		height: 3rem;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-primary);
		border-radius: 50%;
	}

	.player__btn--primary:not(:disabled):hover {
		background: var(--color-secondary);
		border-color: var(--color-secondary);
	}

	.player__timeline {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: 0.2rem;
	}

	.player__time {
		font-size: 0.78rem;
		color: var(--color-foreground);
		min-width: 2.6rem;
		text-align: center;
	}

	.player__timeline input[type='range'] {
		flex: 1;
		appearance: none;
		height: 4px;
		border-radius: 999px;
		background: var(--color-border);
		cursor: pointer;
	}

	.player__timeline input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 999px;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
	}

	.player__timeline input[type='range']::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 999px;
		border: 2px solid var(--color-background);
		background: var(--color-primary);
	}

	.player__playlist {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		border-top: 1px solid var(--color-border);
	}

	.player__playlist-item {
		margin: 0;
	}

	.player__playlist-btn {
		width: 100%;
		text-align: left;
		padding: 0.45rem 0;
		border: none;
		background: transparent;
		color: var(--color-muted);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.player__playlist-btn:hover {
		color: var(--color-foreground);
	}

	.player__playlist-title {
		font-weight: 500;
	}

	.player__playlist-artist {
		font-size: 0.78rem;
		color: var(--color-secondary);
	}

	.player__playlist-item--active .player__playlist-btn {
		color: var(--color-primary);
	}

	.player__pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-border);
	}

	.player__pagination-btn {
		border: none;
		background: var(--color-border);
		color: var(--color-foreground);
		font-size: 1rem;
		cursor: pointer;
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		transition:
			background 0.15s ease,
			opacity 0.15s ease;
	}

	.player__pagination-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.player__pagination-btn:not(:disabled):hover {
		background: var(--color-accent);
	}

	.player__pagination-info {
		font-size: 0.8rem;
		color: var(--color-muted);
		min-width: 6rem;
		text-align: center;
	}

	@media (max-width: 640px) {
		.player {
			grid-template-columns: 1fr;
			padding: 1.25rem 1.25rem 1.35rem;
		}

		.player__left {
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			gap: 1rem;
		}

		.player__header {
			flex-direction: column;
			align-items: flex-start;
		}

	}
</style>
