<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';
    import { Folder, ArrowRight } from 'lucide-svelte';

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
	let cardSpacing = 160; 
	let viewportHeight = 800;
	let rafId: number | null = null;
	let isScrolling = false;

	// Selected repo for the window
	let selectedRepo: Repository | null = null;

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
		const scale = 1 - normalizedDistance * 0.05;

		// Opacity: fade out at extreme edges
		const opacity = Math.max(0.2, 1 - normalizedDistance * 0.6);

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
			const maxScroll = (REPOSITORIES.length - 1) * cardSpacing;
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
		const maxScroll = (REPOSITORIES.length - 1) * cardSpacing;
		targetScrollY += e.deltaY * 0.8;
		targetScrollY = Math.max(-viewportHeight * 0.3, Math.min(maxScroll + viewportHeight * 0.3, targetScrollY));

		if (!isScrolling) {
			isScrolling = true;
			rafId = requestAnimationFrame(animateScroll);
		}
	}

	onMount(() => {
		updateViewport();
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
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateViewport);
			window.removeEventListener('wheel', handleWheelEvent);
		}
	});
</script>

<svelte:head>
	<title>Repositories - Explorer</title>
	<meta name="description" content="Browse repositories with live preview" />
</svelte:head>

<svelte:window
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
/>

<div class="helix-container">
    <div class="background-grid"></div>
	<!-- List Scene -->
	<div class="helix-scene">
		{#each REPOSITORIES as repo, index}
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
					<div class="card-inner {selectedRepo?.name === repo.name ? 'selected' : ''}">
						<RepoCard {repo} />
                        <div class="active-indicator"></div>
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
                <div class="mac-title">
                    <span class="lock-icon">🔒</span>
                    github.com/{selectedRepo.name}
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
	{:else}
        <div class="empty-state">
            <div class="empty-content">
                <div class="icon-circle">
                    <Folder size={32} />
                </div>
                <h2>Select a Repository</h2>
                <p>Choose a project from the sidebar to view its code structure instantly.</p>
                <div class="arrow-hint">
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
	{/if}

	<!-- Scroll hint -->
	<div class="scroll-hint">
		<div class="hint-line"></div>
        <div class="hint-text">SCROLL</div>
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
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	.helix-container {
		width: 100vw;
		height: 100vh;
		background: var(--color-background);
		overflow: hidden;
		position: relative;
		touch-action: none;
	}

    .background-grid {
        position: absolute;
        inset: 0;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
        mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    }

	.helix-scene {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 10;
	}

	.repo-card-wrapper {
		position: absolute;
		width: 340px;
		will-change: transform, opacity;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
        outline: none;
	}

	.repo-card-wrapper:hover {
		z-index: 100 !important;
	}

	.card-inner {
		width: 100%;
		height: 100%;
		transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        border-radius: 8px;
        position: relative;
	}

	.repo-card-wrapper:hover .card-inner {
		transform: scale(1.02) translateX(10px);
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
	}

    .card-inner.selected {
        transform: scale(1.02) translateX(10px);
        border: 1px solid rgba(88, 166, 255, 0.4);
        box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.1), 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    
    .active-indicator {
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%) scale(0);
        width: 4px;
        height: 24px;
        background: #58a6ff;
        border-radius: 2px;
        transition: transform 0.2s ease;
    }

    .card-inner.selected .active-indicator {
        transform: translateY(-50%) scale(1);
    }

	/* Mac Window Styles */
	.mac-window {
		position: fixed;
		top: 80px;
		right: 40px;
		width: calc(100% - 480px);
		height: calc(100vh - 120px);
		background: rgba(30, 30, 30, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
		border-radius: 12px;
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.08),
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 100px 0 rgba(0,0,0,0.3);
		overflow: hidden;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		animation: windowAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

    .empty-state {
        position: fixed;
		top: 80px;
		right: 40px;
		width: calc(100% - 480px);
		height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        z-index: 5;
    }

    .empty-content {
        text-align: center;
        color: #8b949e;
        max-width: 320px;
        opacity: 0;
        animation: fadeIn 0.8s ease forwards 0.2s;
    }

    @keyframes fadeIn {
        to { opacity: 1; transform: translateY(0); }
    }

    .icon-circle {
        width: 64px;
        height: 64px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: #58a6ff;
        border: 1px solid rgba(255,255,255,0.05);
    }

    .empty-state h2 {
        font-size: 18px;
        font-weight: 500;
        color: #c9d1d9;
        margin: 0 0 0.5rem;
    }

    .empty-state p {
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 2rem;
    }

    .arrow-hint {
        color: rgba(255,255,255,0.2);
        animation: bounceX 2s infinite;
    }

    @keyframes bounceX {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-5px); }
    }

	@keyframes windowAppear {
		from {
			opacity: 0;
			transform: translateX(40px) scale(0.95);
            filter: blur(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0) scale(1);
            filter: blur(0);
		}
	}

	.mac-titlebar {
		height: 38px;
		background: rgba(255,255,255,0.03);
		display: flex;
		align-items: center;
		padding: 0 16px;
		flex-shrink: 0;
        position: relative;
        border-bottom: 1px solid rgba(0,0,0,0.2);
	}

	.mac-buttons {
		display: flex;
		gap: 8px;
        z-index: 2;
	}

    .mac-title {
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255,255,255,0.4);
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }

    .lock-icon {
        font-size: 10px;
    }

	.mac-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		padding: 0;
        background: #3a3a3a;
        transition: all 0.2s ease;
        position: relative;
	}
    
    /* Hover icons for buttons */
    .mac-btn::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        font-size: 8px;
        color: rgba(0,0,0,0.5);
        font-family: sans-serif;
        font-weight: 900;
    }
    
    .mac-titlebar:hover .mac-btn::after { opacity: 1; }
    .mac-titlebar:hover .mac-btn.close::after { content: '×'; }
    .mac-titlebar:hover .mac-btn.minimize::after { content: '−'; }
    .mac-titlebar:hover .mac-btn.maximize::after { content: '+'; }

	.mac-titlebar:hover .mac-btn.close { background: #ff5f57; }
	.mac-titlebar:hover .mac-btn.minimize { background: #febc2e; }
	.mac-titlebar:hover .mac-btn.maximize { background: #28c840; }

	.mac-content {
		flex: 1;
		background: #1e1e1e;
		overflow: hidden;
        position: relative;
	}
    
    /* Loading overlay for iframe */
    .mac-content::before {
        content: '';
        position: absolute;
        inset: 0;
        background: #1e1e1e;
        z-index: -1;
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
		left: 80px;
		opacity: 0.3;
		pointer-events: none;
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
	}

    .hint-line {
        width: 1px;
        height: 40px;
        background: linear-gradient(to bottom, #fff, transparent);
    }

	.hint-text {
		font-size: 10px;
		color: #fff;
		letter-spacing: 2px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
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
