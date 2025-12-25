<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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

	// --- PLACEHOLDER DATA ---
	const REPOSITORIES: Repository[] = [
		{
			name: "flutter_the_eye",
			description: "Flutter CustomPaint Library kullanarak göz çizimi yapan bir uygulama.",
			language: "Dart",
			languageColor: "#00B4AB",
			stars: 2,
			forks: 0,
			isPublic: true,
			link: "https://github.com/myusername/flutter_the_eye"
		},
		{
			name: "littleagents",
			description: "300+ ücretsiz AI aracı içeren küratöryel bir liste. 19 kategoride organize edilmiş.",
			language: "Markdown",
			languageColor: "#083fa1",
			stars: 2,
			forks: 0,
			isPublic: true,
			link: "https://github.com/myusername/littleagents"
		},
		{
			name: "stories_w_supabase",
			description: "Arkadaşlarınızla birlikte gerçek zamanlı hikaye yazmanızı sağlayan işbirlikçi uygulama.",
			language: "Dart",
			languageColor: "#00B4AB",
			stars: 1,
			forks: 0,
			isPublic: true,
			link: "https://github.com/myusername/stories_w_supabase"
		},
		{
			name: "vscode-multi-ai",
			description: "GitHub Copilot'a açık kaynaklı bir alternatif. VSCode AI asistan eklentisi.",
			language: "TypeScript",
			languageColor: "#3178c6",
			stars: 1,
			forks: 1,
			isPublic: true,
			link: "https://github.com/myusername/vscode-multi-ai"
		},
		{
			name: "statue-portfolio",
			description: "GitHub tarzı geliştirici portfolyo sitesi. Svelte ve TailwindCSS ile yapıldı.",
			language: "Svelte",
			languageColor: "#ff3e00",
			stars: 5,
			forks: 2,
			isPublic: true,
			link: "https://github.com/myusername/statue-portfolio"
		},
		{
			name: "ai-chat-assistant",
			description: "Modern AI sohbet asistanı. GPT-4 ve Claude entegrasyonu ile.",
			language: "Python",
			languageColor: "#3572A5",
			stars: 12,
			forks: 3,
			isPublic: true,
			link: "https://github.com/myusername/ai-chat-assistant"
		},
		{
			name: "react-dashboard",
			description: "Admin dashboard template. React, TypeScript ve Tailwind CSS.",
			language: "TypeScript",
			languageColor: "#3178c6",
			stars: 8,
			forks: 4,
			isPublic: true,
			link: "https://github.com/myusername/react-dashboard"
		},
		{
			name: "go-microservices",
			description: "Microservices architecture örneği. Go, gRPC ve Kubernetes.",
			language: "Go",
			languageColor: "#00ADD8",
			stars: 15,
			forks: 5,
			isPublic: true,
			link: "https://github.com/myusername/go-microservices"
		},
		{
			name: "rust-cli-tools",
			description: "Performanslı CLI araçları koleksiyonu. Rust ile yazıldı.",
			language: "Rust",
			languageColor: "#dea584",
			stars: 20,
			forks: 7,
			isPublic: true,
			link: "https://github.com/myusername/rust-cli-tools"
		},
		{
			name: "nextjs-blog",
			description: "Kişisel blog template. Next.js 14, MDX ve Tailwind.",
			language: "TypeScript",
			languageColor: "#3178c6",
			stars: 6,
			forks: 2,
			isPublic: true,
			link: "https://github.com/myusername/nextjs-blog"
		},
		{
			name: "swift-ios-app",
			description: "iOS uygulama örneği. SwiftUI ve Combine framework.",
			language: "Swift",
			languageColor: "#F05138",
			stars: 4,
			forks: 1,
			isPublic: true,
			link: "https://github.com/myusername/swift-ios-app"
		},
		{
			name: "kubernetes-configs",
			description: "Production-ready Kubernetes konfigürasyonları ve Helm charts.",
			language: "YAML",
			languageColor: "#cb171e",
			stars: 10,
			forks: 6,
			isPublic: true,
			link: "https://github.com/myusername/kubernetes-configs"
		}
	];

	// --- STATE ---
	let scrollY = 0;
	let targetScrollY = 0;
	let cardSpacing = 160; // Base spacing between cards (must be > card height to prevent overlap)
	let spiralIntensity = 1; // Controls how "S-shaped" the path is
	let viewportHeight = 800;
	let viewportWidth = 400;
	let rafId: number | null = null;
	let isScrolling = false;

	// Selected repo for the window
	let selectedRepo: Repository | null = null;

	// Pinch gesture state
	let initialPinchDistance = 0;
	let initialPinchSpacing = 120;
	let initialPinchIntensity = 1;

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

	// --- HELIX CALCULATIONS ---
	function getHelixTransform(index: number, scrollOffset: number, spacing: number, intensity: number, vpHeight: number, vpWidth: number) {
		const centerY = vpHeight / 2;
		const leftX = 120; // Position helix on the left side

		// Vertical position based on index and scroll
		const baseY = index * spacing - scrollOffset;
		const y = baseY;

		// Distance from center of screen
		const distanceFromCenter = Math.abs(y - centerY);
		const normalizedDistance = Math.min(distanceFromCenter / (vpHeight * 0.5), 1);

		// Sine wave offset for X (creates S-curve path)
		const waveLength = 250 / intensity;
		const spiralPhase = (index * spacing - scrollOffset) / waveLength;
		const spiralAmplitude = (150 + normalizedDistance * 120) * intensity;
		const xOffset = Math.sin(spiralPhase) * spiralAmplitude;

		// Calculate tangent angle of the sine wave path
		// Derivative of sin(phase) = cos(phase) * (1/waveLength)
		// This gives us the slope, then we convert to angle
		const slopeX = Math.cos(spiralPhase) * spiralAmplitude / waveLength;
		const tangentAngle = Math.atan(slopeX) * (180 / Math.PI);

		// Scale: larger at center, smaller at edges
		const scale = 1 - normalizedDistance * 0.35;

		// Opacity: fade out at edges
		const opacity = Math.max(0.4, 1 - normalizedDistance * 0.6);

		// Visibility check - cards can go off screen
		const isVisible = y > -300 && y < vpHeight + 300;

		return {
			x: leftX + xOffset, // Position on left side
			y,
			scale,
			rotation: tangentAngle, // 2D rotation to follow path tangent
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
		} else if (event.touches.length === 2) {
			// Pinch start
			event.preventDefault();
			const touch1 = event.touches[0];
			const touch2 = event.touches[1];
			initialPinchDistance = Math.hypot(
				touch2.clientX - touch1.clientX,
				touch2.clientY - touch1.clientY
			);
			initialPinchSpacing = cardSpacing;
			initialPinchIntensity = spiralIntensity;
		}
	}

	function handleTouchMove(event: TouchEvent) {
		event.preventDefault();

		if (event.touches.length === 1) {
			const deltaY = touchStartY - event.touches[0].clientY;
			const maxScroll = (REPOSITORIES.length - 1) * cardSpacing;
			targetScrollY = touchStartScrollY + deltaY * 1.5;
			targetScrollY = Math.max(-viewportHeight * 0.3, Math.min(maxScroll + viewportHeight * 0.3, targetScrollY));

			if (!isScrolling) {
				isScrolling = true;
				rafId = requestAnimationFrame(animateScroll);
			}
		} else if (event.touches.length === 2) {
			// Pinch - affects both spacing and spiral intensity
			const touch1 = event.touches[0];
			const touch2 = event.touches[1];
			const currentDistance = Math.hypot(
				touch2.clientX - touch1.clientX,
				touch2.clientY - touch1.clientY
			);
			const scale = currentDistance / initialPinchDistance;
			cardSpacing = Math.max(120, Math.min(350, initialPinchSpacing * scale));
			spiralIntensity = Math.max(0.5, Math.min(3, initialPinchIntensity * scale));
		}
	}

	// Update viewport dimensions
	function updateViewport() {
		if (typeof window !== 'undefined') {
			viewportWidth = window.innerWidth;
			viewportHeight = window.innerHeight;
		}
	}

	// Prevent browser zoom on gesture (Safari)
	function preventZoom(event: Event) {
		event.preventDefault();
	}

	// Main wheel handler - needs to be added with passive: false
	function handleWheelEvent(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (e.ctrlKey) {
			// Trackpad pinch
			const delta = e.deltaY * -0.008;
			cardSpacing = Math.max(120, Math.min(350, cardSpacing * (1 + delta)));
			spiralIntensity = Math.max(0.5, Math.min(3, spiralIntensity * (1 + delta)));
		} else {
			// Normal scroll
			const maxScroll = (REPOSITORIES.length - 1) * cardSpacing;
			targetScrollY += e.deltaY * 0.8;
			targetScrollY = Math.max(-viewportHeight * 0.3, Math.min(maxScroll + viewportHeight * 0.3, targetScrollY));

			if (!isScrolling) {
				isScrolling = true;
				rafId = requestAnimationFrame(animateScroll);
			}
		}
	}

	onMount(() => {
		updateViewport();
		window.addEventListener('resize', updateViewport);
		// Add wheel listener with passive: false to allow preventDefault
		window.addEventListener('wheel', handleWheelEvent, { passive: false });
		// Prevent browser zoom gestures
		document.addEventListener('gesturestart', preventZoom);
		document.addEventListener('gesturechange', preventZoom);
		document.addEventListener('gestureend', preventZoom);
		// Start with cards centered
		targetScrollY = -viewportHeight * 0.3;
		scrollY = targetScrollY;
	});

	onDestroy(() => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateViewport);
			window.removeEventListener('wheel', handleWheelEvent);
			document.removeEventListener('gesturestart', preventZoom);
			document.removeEventListener('gesturechange', preventZoom);
			document.removeEventListener('gestureend', preventZoom);
		}
	});
</script>

<svelte:head>
	<title>Playground 2 - 3D Helix Scroll</title>
	<meta name="description" content="3D Helix/Tornado Scroll Animation" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<svelte:window
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
/>

<div class="helix-container">
	<!-- Helix Scene -->
	<div class="helix-scene">
		{#each REPOSITORIES as repo, index}
			{@const transform = getHelixTransform(index, scrollY, cardSpacing, spiralIntensity, viewportHeight, viewportWidth)}
			{#if transform.isVisible}
				<button
					class="repo-card-wrapper"
					style="
						transform: translate({transform.x}px, {transform.y}px) rotate({transform.rotation}deg) scale({transform.scale});
						opacity: {transform.opacity};
					"
					on:click={() => handleCardClick(repo)}
				>
					<RepoCard {repo} />
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
	{/if}

	<!-- Scroll hint -->
	{#if !selectedRepo}
		<div class="scroll-hint">
			<div class="hint-text">Scroll to browse</div>
			<div class="hint-icon">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
				</svg>
			</div>
			<div class="hint-text pinch">Pinch to adjust spacing</div>
		</div>
	{/if}

	<!-- Intensity indicator -->
	<div class="spacing-indicator">
		Spiral: {spiralIntensity.toFixed(1)}x
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 100%;
		/* Hide scrollbar */
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* Prevent browser zoom */
		touch-action: pan-y;
		-ms-touch-action: pan-y;
	}

	:global(html::-webkit-scrollbar),
	:global(body::-webkit-scrollbar) {
		display: none;
	}

	/* Prevent browser zoom on pinch */
	:global(html) {
		touch-action: manipulation;
	}

	.helix-container {
		width: 100vw;
		height: 100vh;
		background: var(--color-background);
		overflow: hidden;
		position: relative;
		/* Hide scrollbar */
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* Prevent browser zoom */
		touch-action: none;
	}

	.helix-container::-webkit-scrollbar {
		display: none;
	}

	.helix-scene {
		width: 100%;
		height: 100%;
		position: relative;
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
	}

	.repo-card-wrapper:hover {
		z-index: 100 !important;
	}

	.repo-card-wrapper:focus {
		outline: none;
	}

	/* Mac Window Styles */
	.mac-window {
		position: fixed;
		top: 60px;
		right: 40px;
		width: 55%;
		height: calc(100vh - 120px);
		background: #1e1e1e;
		border-radius: 12px;
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		overflow: hidden;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		animation: windowAppear 0.3s ease-out;
	}

	@keyframes windowAppear {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.mac-titlebar {
		height: 28px;
		background: #2d2d2d;
		display: flex;
		align-items: center;
		padding: 0 12px;
		flex-shrink: 0;
	}

	.mac-buttons {
		display: flex;
		gap: 8px;
	}

	.mac-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: filter 0.15s ease;
	}

	.mac-btn.close {
		background: #ff5f57;
	}

	.mac-btn.close:hover {
		filter: brightness(0.85);
	}

	.mac-btn.minimize {
		background: #febc2e;
	}

	.mac-btn.minimize:hover {
		filter: brightness(0.85);
	}

	.mac-btn.maximize {
		background: #28c840;
	}

	.mac-btn.maximize:hover {
		filter: brightness(0.85);
	}

	.mac-content {
		flex: 1;
		background: #1e1e1e;
		overflow: hidden;
	}

	.mac-iframe {
		width: 100%;
		height: 100%;
		border: none;
		background: #1e1e1e;
	}

	.scroll-hint {
		position: fixed;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		opacity: 0.6;
		pointer-events: none;
		animation: pulse 2s ease-in-out infinite;
	}

	.hint-text {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.hint-text.pinch {
		font-size: 10px;
		opacity: 0.6;
	}

	.hint-icon {
		width: 24px;
		height: 24px;
		color: rgba(255, 255, 255, 0.7);
		transform: rotate(90deg);
	}

	.hint-icon svg {
		width: 100%;
		height: 100%;
	}

	.spacing-indicator {
		position: fixed;
		top: 80px;
		right: 20px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		background: rgba(0, 0, 0, 0.3);
		padding: 6px 12px;
		border-radius: 20px;
		backdrop-filter: blur(4px);
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 0.6;
		}
		50% {
			opacity: 0.3;
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.music-card {
			width: 260px;
			height: 80px;
		}

		.album-art {
			width: 48px;
			height: 48px;
		}

		.album-emoji {
			font-size: 24px;
		}

		.track-title {
			font-size: 14px;
		}

		.play-button {
			width: 36px;
			height: 36px;
		}
	}
</style>
