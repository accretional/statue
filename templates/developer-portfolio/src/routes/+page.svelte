<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';
	import TimelineWidget from '$lib/components/TimelineWidget.svelte';
	import { onMount } from 'svelte';
	import lottie from 'lottie-web';

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

	interface Features {
		showExperience: boolean;
		showMacScreen: boolean;
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

	// Data from server (site.config.js)
	export let data: {
		profile: UserProfile;
		features: Features;
		repositories: Repository[];
	};

	// Reactive declarations from data with defaults
	$: profile = data?.profile ?? {
		name: '',
		username: '',
		avatarUrl: '/avatar.jpg',
		bio: '',
		followers: 0,
		following: 0,
		location: '',
		website: ''
	};
	$: features = data?.features ?? { showExperience: false, showMacScreen: false };
	$: repositories = data?.repositories ?? [];
	$: leftRepos = repositories.slice(0, 2);
	$: rightRepos = repositories.slice(2, 4);

	let lottieContainer: HTMLDivElement;
	let macBtn: HTMLAnchorElement;

	onMount(() => {
		if (lottieContainer) {
			lottie.loadAnimation({
				container: lottieContainer,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/macbook.json'
			});
		}
	});

	function handleMacClick() {
		if (macBtn) {
			macBtn.style.viewTransitionName = 'mac-hero';
		}
	}

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
</script>

<svelte:head>
	<title>{profile.name} - Portfolio</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="page-container">
	<main class="main-content">
		<!-- Left repos -->
		<div class="repo-column left">
			{#each leftRepos as repo}
				<RepoCard {repo} />
			{/each}
		</div>

		<!-- Center: Profile Sidebar -->
		<div class="sidebar-container">
			<Sidebar {profile} contributionData={CONTRIBUTION_DATA} />
		</div>

		<!-- Right repos -->
		<div class="repo-column right">
			{#each rightRepos as repo}
				<RepoCard {repo} />
			{/each}
			<a href="/repositoriespage" class="view-all-repos">view all repos</a>

			<!-- Timeline Widget -->
			{#if features.showExperience}
				<div class="timeline-widget-container">
					<TimelineWidget />
				</div>
			{/if}
		</div>
	</main>

	<!-- Mobile: All Repos below profile -->
	<div class="mobile-repos">
		{#each repositories as repo}
			<RepoCard {repo} />
		{/each}

		<!-- Mobile Timeline Widget -->
		{#if features.showExperience}
			<div class="mobile-timeline-widget">
				<TimelineWidget />
			</div>
		{/if}
	</div>

	<!-- Mac Desktop Button -->
	{#if features.showMacScreen}
		<a
			href="/macdesktop"
			class="mac-desktop-btn"
			bind:this={macBtn}
			on:click={handleMacClick}
			aria-label="Open Mac Desktop"
		>
			<div bind:this={lottieContainer} class="lottie-icon"></div>
		</a>
	{/if}
</div>

<style>
	.page-container {
		min-height: 100vh;
		background: var(--color-background);
		color: var(--color-foreground);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		padding: 2rem 1rem;
	}

	.main-content {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.repo-column {
		display: none;
		flex-direction: column;
		gap: 1rem;
		width: 320px;
		padding-top: 2rem;
	}

	@media (min-width: 1024px) {
		.repo-column {
			display: flex;
		}
	}

	.sidebar-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 400px;
		width: 100%;
	}

	.mobile-repos {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (min-width: 1024px) {
		.mobile-repos {
			display: none;
		}
	}

	.view-all-repos {
		color: var(--accent-fg);
		text-decoration: underline;
		font-size: 14px;
		margin-top: 0.5rem;
	}

	.view-all-repos:hover {
		color: var(--link-hover);
	}

	.timeline-widget-container {
		margin-top: 1.5rem;
	}

	.mobile-timeline-widget {
		margin-top: 1.5rem;
	}

	/* Mac Desktop Button */
	.mac-desktop-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 120px;
		height: 120px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 100;
		overflow: hidden;
	}

	.mac-desktop-btn:hover {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.mac-desktop-btn:active {
		transform: scale(0.95);
	}

	.lottie-icon {
		width: 160px;
		height: 160px;
	}
</style>
