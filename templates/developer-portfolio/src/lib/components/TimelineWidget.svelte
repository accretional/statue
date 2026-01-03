<script>
	import { goto } from '$app/navigation';

	// Items to display
	export let items = [
		{
			type: 'work',
			title: 'Tech Innovations Inc.',
			role: 'Senior Software Engineer',
			date: '2023 - Present',
			color: '#a371f7'
		},
		{
			type: 'education',
			title: 'University of Technology',
			role: 'B.S. Computer Science',
			date: '2016 - 2020',
			color: '#58a6ff'
		}
	];

	async function handleViewAll() {
		await goto('/timeline');
	}
</script>

<div class="timeline-widget">
	<div class="widget-header">
		<span class="title">Experience</span>
	</div>

	<div class="experience-list">
		{#each items as item}
			<div class="exp-item">
				<div class="exp-icon" style="background: {item.color}">
					{#if item.type === 'work'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
					{:else if item.type === 'education'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
					{/if}
				</div>
				<div class="exp-content">
					<span class="exp-role">{item.role}</span>
					<span class="exp-company">{item.title}</span>
					<span class="exp-date">{item.date}</span>
				</div>
			</div>
		{/each}
	</div>

	<button class="view-all-btn" on:click={handleViewAll}>
		<span>View full timeline</span>
		<span class="btn-arrow">→</span>
		<div class="hero-dot" style="view-transition-name: timeline-hero"></div>
	</button>
</div>

<style>
	.timeline-widget {
		background: var(--glass-bg-strong);
		border: 1px solid var(--border-default);
		border-radius: 12px;
		padding: 16px;
		width: 100%;
		backdrop-filter: blur(12px);
		transition: all 0.3s ease;
	}

	.timeline-widget:hover {
		border-color: var(--border-muted);
	}

	.widget-header {
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--border-default);
	}

	.title {
		font-size: 14px;
		font-weight: 600;
		color: var(--fg-default);
	}

	.experience-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.exp-item {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.exp-icon {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.exp-content {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}

	.exp-role {
		font-size: 13px;
		color: var(--fg-default);
		font-weight: 500;
	}

	.exp-company {
		font-size: 12px;
		color: var(--fg-default);
	}

	.exp-date {
		font-size: 11px;
		color: var(--fg-muted);
	}

	.view-all-btn {
		width: 100%;
		margin-top: 16px;
		padding: 10px 16px;
		background: transparent;
		border: 1px solid var(--border-default);
		border-radius: 8px;
		color: var(--fg-muted);
		font-size: 13px;
		font-family: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.view-all-btn:hover {
		background: var(--accent-subtle);
		color: var(--fg-default);
	}

	.view-all-btn:hover .btn-arrow {
		transform: translateX(4px);
	}

	.btn-arrow {
		transition: transform 0.3s ease;
	}

	.hero-dot {
		position: absolute;
		width: 8px;
		height: 8px;
		background: var(--accent-fg);
		border-radius: 50%;
		right: 20px;
		opacity: 0.6;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-glow-blue);
	}

	.view-all-btn:hover .hero-dot {
		opacity: 1;
		transform: scale(1.3);
		box-shadow: 0 0 12px var(--accent-muted);
	}
</style>
