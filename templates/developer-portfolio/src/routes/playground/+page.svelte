<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
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
		avatarUrl: string;
		bio: string;
		followers: number;
		following: number;
		location: string;
		website: string;
		twitter?: string;
		linkedin?: string;
		company?: string;
		email?: string;
		status?: {
			emoji: string;
			message: string;
		};
	}

	interface ContributionDay {
		date: string;
		count: number;
		level: 0 | 1 | 2 | 3 | 4;
	}

	interface YearContribution {
		year: number;
		total: number;
		days: ContributionDay[];
	}

	// --- CONSTANTS ---
	const USER_PROFILE: UserProfile = {
		name: "My Name",
		username: "myusername",
		avatarUrl: "/avatar.png",
		bio: "Creative developer building thoughtful digital products.",
		followers: 128,
		following: 64,
		location: "Your City",
		website: "https://example.com",
		linkedin: "in/myname",
		company: undefined,
		email: undefined,
		status: {
			emoji: "🚀",
			message: "Building something new"
		}
	};

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
			description: "300+ ücretsiz AI aracı içeren küratöryel bir liste. 19 kategoride organize edilmiş, kalite odaklı bir koleksiyon.",
			language: "Markdown",
			languageColor: "#083fa1",
			stars: 2,
			forks: 0,
			isPublic: true,
			link: "https://github.com/myusername/littleagents"
		},
		{
			name: "stories_w_supabase",
			description: "Arkadaşlarınızla birlikte gerçek zamanlı hikaye yazmanızı sağlayan işbirlikçi bir uygulama.",
			language: "Dart",
			languageColor: "#00B4AB",
			stars: 1,
			forks: 0,
			isPublic: true,
			link: "https://github.com/myusername/stories_w_supabase"
		},
		{
			name: "vscode-multi-ai",
			description: "GitHub Copilot'a açık kaynaklı bir alternatif. VSCode eklentisi olarak kodlama deneyimini geliştiren AI asistan.",
			language: "TypeScript",
			languageColor: "#3178c6",
			stars: 1,
			forks: 1,
			isPublic: true,
			link: "https://github.com/myusername/vscode-multi-ai"
		}
	];

	// Generate contribution data
	function generateContributions(): YearContribution {
		const days: ContributionDay[] = [];
		const today = new Date();
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(today.getFullYear() - 1);

		let total = 0;

		for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
			const chance = Math.random();
			let count = 0;
			let level: 0 | 1 | 2 | 3 | 4 = 0;

			if (chance > 0.8) {
				count = Math.floor(Math.random() * 10) + 5;
				level = 4;
			} else if (chance > 0.6) {
				count = Math.floor(Math.random() * 5) + 3;
				level = 3;
			} else if (chance > 0.4) {
				count = Math.floor(Math.random() * 3) + 1;
				level = 2;
			} else if (chance > 0.2) {
				count = 1;
				level = 1;
			}

			total += count;
			days.push({
				date: d.toISOString().split('T')[0],
				count,
				level
			});
		}

		return {
			year: today.getFullYear(),
			total,
			days
		};
	}

	const CONTRIBUTION_DATA = generateContributions();

	// Generate spiral cards by repeating repos to fill the spiral
	const CARDS_PER_ARM = 5;
	const SPIRAL_CARDS: Repository[] = [];

	// Fill both arms with cards
	for (let i = 0; i < CARDS_PER_ARM * 2; i++) {
		SPIRAL_CARDS.push(REPOSITORIES[i % REPOSITORIES.length]);
	}

	// Two-arm spiral calculations
	let scrollProgress = 0;
	let targetScrollProgress = 0;
	let isScrolling = false;
	let rafId: number | null = null;

	// Viewport dimensions (will be updated)
	let viewportWidth = 1200;
	let viewportHeight = 800;

	// Two-arm spiral: cards spiral from edges toward center
	// Arm 1: Right side -> center
	// Arm 2: Left side -> center
	function getSpiralPosition(
		armIndex: number, // 0 = right arm, 1 = left arm
		cardIndex: number, // 0 = edge card (big, flat), 1+ = toward center
		width: number,
		height: number
	) {
		const centerX = width / 2;
		const centerY = height / 2;

		// Starting positions for each arm
		// Right arm: starts at right edge, vertically centered but slightly up
		// Left arm: starts at left edge, vertically centered but slightly down
		const startX = armIndex === 0 ? width - 200 : 200;
		const startY = armIndex === 0 ? centerY - 100 : centerY + 100;

		// How much each card moves toward center
		const progressPerCard = 0.25;
		const t = Math.min(cardIndex * progressPerCard, 1);

		// Position interpolation from edge to center
		// But with spiral curve
		const spiralAngle = t * Math.PI * 0.5 * (armIndex === 0 ? 1 : -1);

		const distanceToCenter = Math.sqrt(Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2));
		const currentDistance = distanceToCenter * (1 - t * 0.7);

		const baseAngle = Math.atan2(startY - centerY, startX - centerX);
		const currentAngle = baseAngle + spiralAngle;

		const x = centerX + currentDistance * Math.cos(currentAngle);
		const y = centerY + currentDistance * Math.sin(currentAngle);

		// Card rotation: FIRST CARD IS FLAT (0°), then increases toward center
		// Use easeIn so rotation starts slow
		const rotationT = Math.pow(t, 1.5);
		const rotation = rotationT * 55 * (armIndex === 0 ? 1 : -1);

		// Scale: first card is BIG (1.0), decreases toward center
		const scale = 1.0 - t * 0.55;

		// Z-index: edge cards on top
		const zIndex = Math.round((1 - t) * 50) + (cardIndex === 0 ? 10 : 0);

		return { x, y, rotation, scale, zIndex };
	}

	// Calculate card positions based on scroll progress
	// Split cards between two spiral arms
	$: cardPositions = SPIRAL_CARDS.map((_, index) => {
		const totalCards = SPIRAL_CARDS.length;
		const cardsPerArm = totalCards / 2;

		// Determine which arm and position within arm
		const armIndex = index < cardsPerArm ? 0 : 1;
		const indexInArm = index < cardsPerArm ? index : index - cardsPerArm;

		// Adjust card index based on scroll progress (cards move along spiral)
		const adjustedIndex = indexInArm + scrollProgress * 2;

		return getSpiralPosition(armIndex, adjustedIndex, viewportWidth, viewportHeight);
	});

	// Smooth animation loop using requestAnimationFrame
	function animateScroll() {
		const diff = targetScrollProgress - scrollProgress;

		// Lerp towards target (easing)
		if (Math.abs(diff) > 0.0001) {
			scrollProgress += diff * 0.12;
			rafId = requestAnimationFrame(animateScroll);
		} else {
			scrollProgress = targetScrollProgress;
			isScrolling = false;
			rafId = null;
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		// Update target scroll progress
		targetScrollProgress += event.deltaY * 0.001;
		targetScrollProgress = Math.max(-0.3, Math.min(1.2, targetScrollProgress));

		// Start animation loop if not already running
		if (!isScrolling) {
			isScrolling = true;
			rafId = requestAnimationFrame(animateScroll);
		}
	}

	// Update viewport dimensions
	function updateViewport() {
		if (typeof window !== 'undefined') {
			viewportWidth = window.innerWidth;
			viewportHeight = window.innerHeight;
		}
	}

	onMount(() => {
		updateViewport();
		window.addEventListener('resize', updateViewport);
	});

	// Cleanup on component destroy
	onDestroy(() => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateViewport);
		}
	});

</script>

<svelte:head>
	<title>{USER_PROFILE.name} - GitHub Portfolio</title>
	<meta name="description" content={USER_PROFILE.bio} />
</svelte:head>

<svelte:window on:wheel|nonpassive={handleWheel} />

<div class="page-container">
	<!-- Spiral cards layer -->
	<div class="helix-layer">
		<!-- Cards on the two-arm spiral -->
		{#each SPIRAL_CARDS as repo, index}
			{@const pos = cardPositions[index]}
			<div
				class="helix-card"
				style="
					transform: translate3d({pos.x - 160}px, {pos.y - 100}px, 0) rotate({pos.rotation}deg) scale({pos.scale});
					z-index: {pos.zIndex};
				"
			>
				<RepoCard {repo} />
			</div>
		{/each}
	</div>

	<!-- Main content -->
	<main class="main-content">
		<!-- Center Column: Profile Sidebar -->
		<div class="sidebar-container">
			<Sidebar profile={USER_PROFILE} contributionData={CONTRIBUTION_DATA} />

			<!-- Mobile: All Repos (normal layout) -->
			<div class="mobile-repos">
				{#each REPOSITORIES as repo}
					<RepoCard {repo} />
				{/each}
			</div>
		</div>
	</main>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 100%;
	}

	.page-container {
		height: 100vh;
		background: var(--color-background);
		color: var(--color-foreground);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		position: relative;
		overflow: hidden;
	}

	/* Helix layer - full width */
	.helix-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		display: none;
		pointer-events: none;
	}

	@media (min-width: 1024px) {
		.helix-layer {
			display: block;
		}
	}

	.helix-card {
		position: absolute;
		width: 320px;
		cursor: pointer;
		will-change: transform;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		pointer-events: auto;
	}

	.helix-card:hover {
		z-index: 100 !important;
		transition: transform 0.15s ease-out;
	}

	/* Main content - centered */
	.main-content {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 2rem 1rem;
		height: 100%;
		overflow-y: auto;
		pointer-events: none;
	}

	.sidebar-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 400px;
		width: 100%;
		pointer-events: auto;
	}

	.mobile-repos {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	@media (min-width: 1024px) {
		.mobile-repos {
			display: none;
		}
	}
</style>
