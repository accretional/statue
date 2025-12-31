<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { invalidate } from '$app/navigation';
	import RepoCard from '$lib/components/RepoCard.svelte';

	// --- TYPES ---

	interface Repository {
		name: string;
		description: string;
		language: string;
		languageColor: string;
		stars: number;
		forks: number;
		isPublic: boolean;
		link: string;
	}

	interface UserProfile {
		name: string;
		username: string;
	}

	export let data: {
		repositories: Repository[];
		profile: UserProfile;
	};
	let repositories: Repository[] = [];

	$: repositories = data.repositories ?? [];
	$: profile = data.profile;

	// --- STATE ---
	let scrollY = 0;
	let targetScrollY = 0;
	let cardSpacing = 160; 
	let viewportHeight = 800;
	let rafId: number | null = null;
	let isScrolling = false;

	// Selected repo for the window
	let selectedRepo: Repository | null = null;

	// Pinch gesture state
	let initialPinchDistance = 0;
	let initialPinchSpacing = 120;
	let initialPinchIntensity = 1;

    // --- ASCII WAVE ANIMATION ---
    let asciiFrame = '';
    let asciiRafId: number | null = null;
    let frameCount = 0;

    function animateAscii() {
        const width = 120; // Increased width
        const height = 40; // Increased height
        let output = '';
        
        // Characters from dense to light
        const chars = " .:-=+*#%@";

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const n = (Math.sin(x * 0.1 + frameCount * 0.05) + Math.cos(y * 0.2 + frameCount * 0.03)) * 2;
                const index = Math.floor(((n + 4) / 8) * chars.length);
                const charIndex = Math.max(0, Math.min(chars.length - 1, index));
                output += chars[charIndex];
            }
            output += '\n';
        }
        
        asciiFrame = output;
        frameCount++;
        asciiRafId = requestAnimationFrame(animateAscii);
    }

	// Handle card click
	function handleCardClick(repo: Repository) {
		selectedRepo = repo;
	}

	// Close window
	function closeWindow() {
		selectedRepo = null;
	}

	// Get github1s URL from repo link
	function getGithub1sUrl(link: string): string {
		return link.replace('github.com', 'github1s.com');
	}

	// --- STRAIGHT LIST CALCULATIONS ---
	function getListTransform(index: number, scrollOffset: number, spacing: number, vpHeight: number) {
		const centerY = vpHeight / 2;
		const startX = 60; // Fixed X position for straight list

		// Vertical position based on index and scroll
		const baseY = index * spacing - scrollOffset;
		const y = baseY;

		// Distance from center of screen (for scaling/opacity effects)
		const distanceFromCenter = Math.abs(y - centerY);
		const normalizedDistance = Math.min(distanceFromCenter / (vpHeight * 0.5), 1);

		// Scale: slightly larger at center
		const scale = 1 - normalizedDistance * 0.15;

		// Opacity: fade out at extreme edges
		const opacity = Math.max(0.4, 1 - normalizedDistance * 0.5);

		// Visibility check
		const isVisible = y > -300 && y < vpHeight + 300;

		return {
			x: startX,
			y,
			scale,
			opacity,
			isVisible
		};
	}

	// Smooth animation loop
	function animateScroll() {
		const diff = targetScrollY - scrollY;

		if (Math.abs(diff) > 0.5) {
			scrollY += diff * 0.12;
			rafId = requestAnimationFrame(animateScroll);
		} else {
			scrollY = targetScrollY;
			isScrolling = false;
			rafId = null;
		}
	}

	// Touch handling for mobile scroll
	let touchStartY = 0;
	let touchStartScrollY = 0;

	function handleTouchStart(event: TouchEvent) {
		if (event.touches.length === 1) {
			touchStartY = event.touches[0].clientY;
			touchStartScrollY = targetScrollY;
		}
	}

	function handleTouchMove(event: TouchEvent) {
		if (event.touches.length === 1) {
			const deltaY = touchStartY - event.touches[0].clientY;
			const maxScroll = Math.max(0, (repositories.length - 1) * cardSpacing);
			targetScrollY = touchStartScrollY + deltaY * 1.5;
			targetScrollY = Math.max(-viewportHeight * 0.3, Math.min(maxScroll + viewportHeight * 0.3, targetScrollY));

			if (!isScrolling) {
				isScrolling = true;
				rafId = requestAnimationFrame(animateScroll);
			}
		}
	}

	// Update viewport dimensions
	function updateViewport() {
		if (typeof window !== 'undefined') {
			viewportHeight = window.innerHeight;
		}
	}

	// Main wheel handler
	function handleWheelEvent(e: WheelEvent) {
		e.preventDefault();
		const maxScroll = Math.max(0, (repositories.length - 1) * cardSpacing);
		targetScrollY += e.deltaY * 0.8;
		targetScrollY = Math.max(-viewportHeight * 0.3, Math.min(maxScroll + viewportHeight * 0.3, targetScrollY));

		if (!isScrolling) {
			isScrolling = true;
			rafId = requestAnimationFrame(animateScroll);
		}
	}

	onMount(() => {
		// Invalidate cache to get fresh data on navigation
		invalidate('data:repositories');

		updateViewport();
        animateAscii();
		window.addEventListener('resize', updateViewport);
		window.addEventListener('wheel', handleWheelEvent, { passive: false });
		// Start with cards centered
		targetScrollY = -viewportHeight * 0.1;
		scrollY = targetScrollY;
	});

	onDestroy(() => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
        if (asciiRafId !== null) {
            cancelAnimationFrame(asciiRafId);
        }
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateViewport);
			window.removeEventListener('wheel', handleWheelEvent);
		}
	});
</script>

<svelte:head>
	<title>{profile.name} - Repositories</title>
	<meta name="description" content="Browse {profile.name}'s repositories with live preview" />
</svelte:head>

<svelte:window
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
/>

<div class="helix-container">
	<!-- List Scene -->
	<div class="helix-scene">
		{#each repositories as repo, index}
			{@const transform = getListTransform(index, scrollY, cardSpacing, viewportHeight)}
			{#if transform.isVisible}
				<button
					class="repo-card-wrapper"
					style="
						transform: translate({transform.x}px, {transform.y}px) scale({transform.scale});
					opacity: {transform.opacity};
				"
				on:click={() => handleCardClick(repo)}
			>
					<div class="card-inner">
						<RepoCard {repo} />
					</div>
				</button>
			{/if}
		{/each}
	</div>

	<!-- Mac Window -->
	{#if selectedRepo}
		<div class="mac-window">
			<!-- Title Bar -->
			<div class="mac-titlebar">
				<div class="mac-buttons">
					<button class="mac-btn close" on:click={closeWindow}></button>
					<button class="mac-btn minimize"></button>
					<button class="mac-btn maximize"></button>
				</div>
                <div class="mac-title">{selectedRepo.name} — {selectedRepo.language}</div>
			</div>
			<!-- Content -->
			<div class="mac-content">
				<iframe
					src={getGithub1sUrl(selectedRepo.link)}
					title={selectedRepo.name}
					class="mac-iframe"
				></iframe>
			</div>
		</div>
	{:else}
        <div class="empty-state">
            <div class="ascii-art">
                <pre>{asciiFrame}</pre>
            </div>
            <div class="empty-icon">📂</div>
            <h2>Select a repository</h2>
            <p>Click on a card to explore the code in VS Code view</p>
        </div>
	{/if}

	<!-- Scroll hint -->
	<div class="scroll-hint">
		<div class="hint-text">Scroll to browse</div>
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 100%;
		scrollbar-width: none;
	}

	.helix-container {
		width: 100vw;
		height: 100vh;
		background: var(--color-background);
		overflow: hidden;
		position: relative;
		touch-action: none;
	}

	.helix-scene {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 10;
	}

	.repo-card-wrapper {
		position: absolute;
		width: 320px;
		will-change: transform, opacity;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		/* Transition handled by JS for position, remove CSS transition for transform to avoid conflict */
	}

	.repo-card-wrapper:hover {
		z-index: 100 !important;
	}

	.card-inner {
		width: 100%;
		height: 100%;
		transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.repo-card-wrapper:hover .card-inner {
		transform: scale(1.05) translateX(10px);
	}

	/* Mac Window Styles */
	.mac-window {
		position: fixed;
		top: 80px;
		right: 40px;
		width: calc(100% - 460px);
		height: calc(100vh - 120px);
		background: var(--color-mac-bg, #1e1e1e);
		border-radius: 12px;
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		overflow: hidden;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		animation: windowAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

    .empty-state {
        position: fixed;
		top: 80px;
		right: 40px;
		width: calc(100% - 460px);
		height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-muted);
        border: 2px dashed var(--color-border);
        border-radius: 12px;
        z-index: 5;
    }

    .ascii-art {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.15;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
    }

    .ascii-art pre {
        font-family: var(--font-mono, monospace);
        font-size: 1.5vh;
        line-height: 1.2;
        color: var(--color-muted);
        white-space: pre;
        text-align: center;
        margin: 0;
    }

    .empty-icon {
        font-size: 48px;
        margin-bottom: 1rem;
    }

	@keyframes windowAppear {
		from {
			opacity: 0;
			transform: translateX(30px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateX(0) scale(1);
		}
	}

	.mac-titlebar {
		height: 32px;
		background: var(--color-mac-titlebar, #2d2d2d);
		display: flex;
		align-items: center;
		padding: 0 12px;
		flex-shrink: 0;
        position: relative;
	}

	.mac-buttons {
		display: flex;
		gap: 8px;
        z-index: 2;
	}

    .mac-title {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: var(--color-muted);
        pointer-events: none;
    }

	.mac-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		padding: 0;
        background: #4d4d4d;
        transition: background 0.2s ease;
	}

	.mac-titlebar:hover .mac-btn.close { background: #ff5f57; }
	.mac-titlebar:hover .mac-btn.minimize { background: #febc2e; }
	.mac-titlebar:hover .mac-btn.maximize { background: #28c840; }

	.mac-content {
		flex: 1;
		background: var(--color-mac-bg, #1e1e1e);
		overflow: hidden;
	}

	.mac-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	.scroll-hint {
		position: fixed;
		bottom: 20px;
		left: 60px;
		opacity: 0.5;
		pointer-events: none;
        z-index: 20;
	}

	.hint-text {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	@media (max-width: 1024px) {
		.mac-window, .empty-state {
			width: calc(100% - 40px);
            left: 20px;
            right: 20px;
            height: 60vh;
            top: auto;
            bottom: 20px;
		}
        .repo-card-wrapper {
            width: calc(100% - 120px);
        }
	}
</style>
