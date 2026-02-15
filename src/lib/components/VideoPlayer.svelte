<script>
	import { onMount } from 'svelte';

	// Props
	let {
		src, // Video source URL (direct file, YouTube, or Vimeo)
		title = '', // Optional title displayed on the video
		muted = true, // Whether video starts muted
		autoplay = false, // Whether video autoplays
		loop = false, // Whether video loops
		controls = true, // Whether to show controls
		onRemove = null, // Callback function when remove button is clicked
		globalPlayState = null, // External play control
		globalMuteState = null // External mute control
	} = $props();

	let videoElement = $state(null);
	let youtubePlayer = $state(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(muted ? 0 : 1);
	let isMuted = $state(muted);
	let isFullscreen = $state(false);
	let showControls = $state(true);
	let controlsTimeout = $state(null);
	let hasError = $state(false);
	let errorMessage = $state('');
	let playerId = $state(`yt-player-${Math.random().toString(36).substr(2, 9)}`);
	let youtubeReady = $state(false);

	// Detect video type and extract embed info
	let videoInfo = $derived(() => {
		if (!src) return { type: 'unknown', embedUrl: null, videoId: null };

		// YouTube detection
		const youtubePatterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
			/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
		];

		for (const pattern of youtubePatterns) {
			const match = src.match(pattern);
			if (match) {
				const videoId = match[1];
				return {
					type: 'youtube',
					videoId,
					embedUrl: null
				};
			}
		}

		// Vimeo detection
		const vimeoPattern = /(?:vimeo\.com\/)(\d+)/;
		const vimeoMatch = src.match(vimeoPattern);
		if (vimeoMatch) {
			const videoId = vimeoMatch[1];
			const params = new URLSearchParams();
			if (autoplay) params.set('autoplay', '1');
			if (muted) params.set('muted', '1');
			if (loop) params.set('loop', '1');

			return {
				type: 'vimeo',
				videoId,
				embedUrl: `https://player.vimeo.com/video/${videoId}?${params.toString()}`
			};
		}

		// Direct video file
		return {
			type: 'direct',
			videoId: null,
			embedUrl: src
		};
	});
	
	let isYoutube = $derived(videoInfo().type === 'youtube');
	let isVimeo = $derived(videoInfo().type === 'vimeo');
	let isEmbedded = $derived(isYoutube || isVimeo);

	// Load YouTube IFrame API
	function loadYouTubeAPI() {
		return new Promise((resolve) => {
			if (window.YT && window.YT.Player) {
				resolve();
				return;
			}

			if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
				// Script already loading, wait for it
				const checkReady = setInterval(() => {
					if (window.YT && window.YT.Player) {
						clearInterval(checkReady);
						resolve();
					}
				}, 100);
				return;
			}

			window.onYouTubeIframeAPIReady = () => {
				resolve();
			};

			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		});
	}

	// Initialize YouTube player
	async function initYouTubePlayer() {
		const info = videoInfo();
		if (info.type !== 'youtube' || !info.videoId) return;

		// Wait for the DOM element to exist
		const playerDiv = document.getElementById(playerId);
		if (!playerDiv) {
			// Retry after a short delay if DOM isn't ready
			setTimeout(() => initYouTubePlayer(), 100);
			return;
		}

		// Don't reinitialize if already done
		if (youtubePlayer) return;

		await loadYouTubeAPI();

		// Double-check we still need to initialize
		if (youtubePlayer) return;

		try {
			youtubePlayer = new window.YT.Player(playerId, {
				videoId: info.videoId,
				playerVars: {
					autoplay: autoplay ? 1 : 0,
					mute: muted ? 1 : 0,
					loop: loop ? 1 : 0,
					controls: 1,
					rel: 0,
					modestbranding: 1,
					playsinline: 1
				},
				events: {
					onReady: (event) => {
						youtubeReady = true;
						if (muted) {
							event.target.mute();
						}
					},
					onStateChange: (event) => {
						if (window.YT && window.YT.PlayerState) {
							isPlaying = event.data === window.YT.PlayerState.PLAYING;
						}
					},
					onError: () => {
						hasError = true;
						errorMessage = 'Failed to load YouTube video.';
					}
				}
			});
		} catch (e) {
			console.error('Failed to create YouTube player:', e);
			hasError = true;
			errorMessage = 'Failed to initialize YouTube player.';
		}
	}

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;

		return () => {
			isMounted = false;
			if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
				try {
					youtubePlayer.destroy();
				} catch (e) {
					// Ignore destroy errors
				}
			}
		};
	});

	// Initialize YouTube player when conditions are met
	$effect(() => {
		const info = videoInfo();
		if (isMounted && info.type === 'youtube' && !youtubePlayer) {
			// Small delay to ensure DOM is ready
			setTimeout(() => initYouTubePlayer(), 50);
		}
	});

	function togglePlay() {
		if (isYoutube && youtubePlayer && youtubeReady) {
			if (isPlaying) {
				youtubePlayer.pauseVideo();
			} else {
				youtubePlayer.playVideo();
			}
		} else if (videoElement) {
			if (isPlaying) {
				videoElement.pause();
			} else {
				videoElement.play();
			}
		}
	}

	function handleTimeUpdate() {
		if (videoElement) {
			currentTime = videoElement.currentTime;
		}
	}

	function handleLoadedMetadata() {
		if (videoElement) {
			duration = videoElement.duration;
		}
	}

	function handleSeek(e) {
		if (!videoElement) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const percent = (e.clientX - rect.left) / rect.width;
		videoElement.currentTime = percent * duration;
	}

	function toggleMute() {
		if (isYoutube && youtubePlayer && youtubeReady) {
			if (youtubePlayer.isMuted()) {
				youtubePlayer.unMute();
				isMuted = false;
			} else {
				youtubePlayer.mute();
				isMuted = true;
			}
		} else if (videoElement) {
			isMuted = !isMuted;
			videoElement.muted = isMuted;
			if (!isMuted && volume === 0) {
				volume = 0.5;
				videoElement.volume = 0.5;
			}
		}
	}

	function handleVolumeChange(e) {
		if (!videoElement) return;
		volume = parseFloat(e.target.value);
		videoElement.volume = volume;
		isMuted = volume === 0;
		videoElement.muted = isMuted;
	}

	function toggleFullscreen() {
		const container = document.getElementById(`container-${playerId}`);
		if (!container) return;

		if (!document.fullscreenElement) {
			container.requestFullscreen();
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function formatTime(seconds) {
		if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleMouseMove() {
		showControls = true;
		if (controlsTimeout) clearTimeout(controlsTimeout);
		controlsTimeout = setTimeout(() => {
			if (isPlaying && !isEmbedded) showControls = false;
		}, 2500);
	}

	function handleMouseLeave() {
		if (isPlaying && !isEmbedded) {
			controlsTimeout = setTimeout(() => {
				showControls = false;
			}, 1000);
		}
	}

	function handleError(e) {
		hasError = true;
		errorMessage = 'Failed to load video. Please check the URL.';
	}

	function handlePlay() {
		isPlaying = true;
	}

	function handlePause() {
		isPlaying = false;
	}

	$effect(() => {
		const handleFullscreenChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
			if (controlsTimeout) clearTimeout(controlsTimeout);
		};
	});

	// Track last global states to detect changes
	let lastGlobalPlayState = $state(null);
	let lastGlobalMuteState = $state(null);

	// Parse play command from state string like "play-123" or "pause-456"
	function parsePlayCommand(state) {
		if (!state || typeof state !== 'string') return null;
		if (state.startsWith('play-')) return 'play';
		if (state.startsWith('pause-')) return 'pause';
		return null;
	}

	// Parse mute state from string like "true-123" or "false-456"
	function parseMuteState(state) {
		if (!state || typeof state !== 'string') return null;
		if (state.startsWith('true-')) return true;
		if (state.startsWith('false-')) return false;
		return null;
	}

	// Respond to global play state changes
	$effect(() => {
		if (globalPlayState !== lastGlobalPlayState && globalPlayState !== null) {
			lastGlobalPlayState = globalPlayState;
			const command = parsePlayCommand(globalPlayState);

			if (isYoutube && youtubePlayer && youtubeReady) {
				try {
					if (command === 'play' && typeof youtubePlayer.playVideo === 'function') {
						youtubePlayer.playVideo();
					} else if (command === 'pause' && typeof youtubePlayer.pauseVideo === 'function') {
						youtubePlayer.pauseVideo();
					}
				} catch (e) {
					console.warn('YouTube player control failed:', e);
				}
			} else if (videoElement) {
				if (command === 'play') {
					videoElement.play().catch(() => {});
				} else if (command === 'pause') {
					videoElement.pause();
				}
			}
		}
	});

	// Respond to global mute state changes
	$effect(() => {
		if (globalMuteState !== lastGlobalMuteState && globalMuteState !== null) {
			lastGlobalMuteState = globalMuteState;
			const shouldMute = parseMuteState(globalMuteState);

			if (shouldMute === null) return;

			if (isYoutube && youtubePlayer && youtubeReady) {
				try {
					if (shouldMute && typeof youtubePlayer.mute === 'function') {
						youtubePlayer.mute();
					} else if (!shouldMute && typeof youtubePlayer.unMute === 'function') {
						youtubePlayer.unMute();
					}
					isMuted = shouldMute;
				} catch (e) {
					console.warn('YouTube player mute control failed:', e);
				}
			} else if (videoElement) {
				isMuted = shouldMute;
				videoElement.muted = shouldMute;
				if (!shouldMute && volume === 0) {
					volume = 0.5;
					videoElement.volume = 0.5;
				}
			}
		}
	});
</script>

<div
	id="container-{playerId}"
	class="video-player-container"
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
>
	{#if title || onRemove}
		<div class="video-header" class:visible={showControls || isEmbedded}>
			{#if title}
				<span class="video-title">{title}</span>
			{/if}
			{#if onRemove}
				<button
					class="remove-btn"
					onclick={onRemove}
					title="Remove video"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>
	{/if}

	{#if hasError}
		<div class="error-overlay">
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<p>{errorMessage}</p>
		</div>
	{:else if isYoutube}
		<!-- YouTube player with API control -->
		<div class="embed-wrapper">
			<div id={playerId}></div>
		</div>
	{:else if isVimeo}
		<!-- Vimeo embedded player -->
		<div class="embed-wrapper">
			<iframe
				src={videoInfo().embedUrl}
				title={title || 'Video player'}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	{:else}
		<!-- Direct video file player -->
		<div class="video-wrapper" onclick={togglePlay}>
			<video
				bind:this={videoElement}
				src={videoInfo().embedUrl}
				{muted}
				{autoplay}
				{loop}
				controls={false}
				playsinline
				ontimeupdate={handleTimeUpdate}
				onloadedmetadata={handleLoadedMetadata}
				onplay={handlePlay}
				onpause={handlePause}
				onerror={handleError}
			>
				<track kind="captions" />
			</video>

			{#if !isPlaying}
				<div class="play-overlay">
					<div class="play-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
							<polygon points="5 3 19 12 5 21 5 3"></polygon>
						</svg>
					</div>
				</div>
			{/if}
		</div>

		{#if controls}
			<div class="custom-controls" class:visible={showControls}>
				<button class="control-btn" onclick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
					{#if isPlaying}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="4" width="4" height="16"></rect>
							<rect x="14" y="4" width="4" height="16"></rect>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<polygon points="5 3 19 12 5 21 5 3"></polygon>
						</svg>
					{/if}
				</button>

				<div class="time-display">
					{formatTime(currentTime)} / {formatTime(duration)}
				</div>

				<div class="progress-bar" onclick={handleSeek}>
					<div class="progress-track">
						<div
							class="progress-fill"
							style="width: {duration ? (currentTime / duration) * 100 : 0}%"
						></div>
					</div>
				</div>

				<div class="volume-control">
					<button class="control-btn" onclick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
						{#if isMuted || volume === 0}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
								<line x1="23" y1="9" x2="17" y2="15"></line>
								<line x1="17" y1="9" x2="23" y2="15"></line>
							</svg>
						{:else if volume < 0.5}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
								<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
								<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
							</svg>
						{/if}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={volume}
						oninput={handleVolumeChange}
						class="volume-slider"
					/>
				</div>

				<button class="control-btn" onclick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
					{#if isFullscreen}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.video-player-container {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--color-background);
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.video-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
		z-index: 20;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.video-header.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.video-title {
		color: var(--color-foreground);
		font-size: 14px;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0,0,0,0.5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100% - 40px);
	}

	.remove-btn {
		background: var(--color-border);
		border: none;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--color-foreground);
		transition: background 0.2s ease;
		flex-shrink: 0;
		pointer-events: auto;
	}

	.remove-btn:hover {
		background: var(--color-accent);
		opacity: 0.8;
	}

	.embed-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.embed-wrapper iframe,
	.embed-wrapper :global(iframe) {
		width: 100%;
		height: 100%;
		border: none;
	}

	.video-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.play-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0,0,0,0.3);
		pointer-events: none;
	}

	.play-button {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: var(--color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-on-primary);
		transition: transform 0.2s ease, background 0.2s ease;
		border: 2px solid var(--color-border);
	}

	.video-wrapper:hover .play-button {
		transform: scale(1.1);
		background: var(--color-secondary);
	}

	.error-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--color-background);
		color: var(--color-muted);
		padding: 20px;
		text-align: center;
	}

	.error-overlay p {
		margin-top: 16px;
		color: var(--color-muted);
		font-size: 14px;
	}

	.custom-controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 10;
	}

	.custom-controls.visible {
		opacity: 1;
	}

	.control-btn {
		background: transparent;
		border: none;
		color: var(--color-foreground);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.control-btn:hover {
		opacity: 1;
		transform: scale(1.1);
	}

	.time-display {
		color: var(--color-foreground);
		font-size: 12px;
		min-width: 80px;
		text-align: center;
	}

	.progress-bar {
		flex: 1;
		height: 20px;
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 6px 0;
	}

	.progress-track {
		width: 100%;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		border-radius: 2px;
		transition: width 0.1s linear;
	}

	.progress-bar:hover .progress-track {
		height: 6px;
	}

	.volume-control {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.volume-slider {
		width: 60px;
		height: 4px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--color-border);
		border-radius: 2px;
		cursor: pointer;
	}

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
		cursor: pointer;
	}

	.volume-slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
		border: 2px solid var(--color-background);
	}

	@media (max-width: 480px) {
		.time-display {
			display: none;
		}

		.volume-slider {
			display: none;
		}

		.custom-controls {
			gap: 4px;
			padding: 8px;
		}
	}
</style>
