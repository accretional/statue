<script lang="ts">
	export let data: {
		total: number;
		lastSynced?: string;
		days: Array<{
			date: string;
			count: number;
			level: number;
		}>;
	};

	export let username: string = '';

	// Tooltip state
	let tooltipText = '';
	let tooltipVisible = false;
	let tooltipX = 0;
	let tooltipY = 0;

	function getLevelColor(level: number): string {
		switch (level) {
			case 1: return 'bg-contribution-1';
			case 2: return 'bg-contribution-2';
			case 3: return 'bg-contribution-3';
			case 4: return 'bg-contribution-4';
			default: return 'bg-contribution-0';
		}
	}

	// Get GitHub activity URL for a specific date
	function getActivityUrl(date: string): string {
		if (!username) return '#';
		return `https://github.com/${username}?tab=overview&from=${date}&to=${date}`;
	}

	// Format date for display
	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Show tooltip
	function showTooltip(event: MouseEvent, day: { date: string; count: number }) {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		tooltipX = rect.left + rect.width / 2;
		tooltipY = rect.top - 8;
		tooltipText = `${day.count} contributions on ${formatDate(day.date)}`;
		tooltipVisible = true;
	}

	// Hide tooltip
	function hideTooltip() {
		tooltipVisible = false;
	}

	// Group days into weeks for column layout (7 days per column)
	$: weeks = (() => {
		if (!data.days || data.days.length === 0) return [];

		const result: Array<Array<typeof data.days[0] | null>> = [];
		let currentWeek: Array<typeof data.days[0] | null> = [];

		// Align start day
		const startDay = new Date(data.days[0].date).getDay(); // 0 is Sunday
		for (let i = 0; i < startDay; i++) {
			currentWeek.push(null);
		}

		data.days.forEach((day) => {
			currentWeek.push(day);
			if (currentWeek.length === 7) {
				result.push(currentWeek);
				currentWeek = [];
			}
		});
		if (currentWeek.length > 0) result.push(currentWeek);

		return result;
	})();

	// Get last synced date display
	$: lastSyncedDisplay = data.lastSynced ? formatDate(data.lastSynced) : null;
</script>

<!-- Custom Tooltip -->
{#if tooltipVisible}
	<div
		class="custom-tooltip"
		style="left: {tooltipX}px; top: {tooltipY}px;"
	>
		{tooltipText}
	</div>
{/if}

<div class="contribution-wrapper">
	<div class="contribution-grid">
		{#each weeks as week}
			<div class="week-column">
				{#each week as day}
					{#if day}
						<a
							href={getActivityUrl(day.date)}
							target="_blank"
							rel="noopener noreferrer"
							class="day-cell {getLevelColor(day.level)}"
							on:mouseenter={(e) => showTooltip(e, day)}
							on:mouseleave={hideTooltip}
						></a>
					{:else}
						<div class="day-cell empty"></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>

	<div class="contribution-footer">
		<span class="contribution-total">
			{data.total} contributions in the last year
		</span>
		{#if lastSyncedDisplay}
			<span class="sync-date">
				Last synced: {lastSyncedDisplay}
			</span>
		{/if}
	</div>
</div>

<style>
	.custom-tooltip {
		position: fixed;
		transform: translateX(-50%) translateY(-100%);
		background: var(--canvas-overlay, #1c2128);
		color: var(--fg-default, #c9d1d9);
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		white-space: nowrap;
		z-index: 1000;
		pointer-events: none;
		border: 1px solid var(--border-default, #30363d);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.contribution-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.contribution-grid {
		display: flex;
		gap: 3px;
		justify-content: center;
	}

	.week-column {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.day-cell {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		cursor: pointer;
		display: block;
	}

	.day-cell:not(.empty):hover {
		transform: scale(1.3);
		z-index: 10;
		box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
	}

	.day-cell.empty {
		background: transparent;
		cursor: default;
	}

	/* Contribution level colors - fallback values */
	:global(.bg-contribution-0) { background-color: var(--contribution-0, #161b22); }
	:global(.bg-contribution-1) { background-color: var(--contribution-1, #0e4429); }
	:global(.bg-contribution-2) { background-color: var(--contribution-2, #006d32); }
	:global(.bg-contribution-3) { background-color: var(--contribution-3, #26a641); }
	:global(.bg-contribution-4) { background-color: var(--contribution-4, #39d353); }

	.contribution-footer {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.contribution-total {
		font-size: 0.7rem;
		font-family: var(--font-mono, monospace);
		color: var(--fg-muted, #8b949e);
	}

	.sync-date {
		font-size: 0.6rem;
		color: var(--fg-muted, #8b949e);
		opacity: 0.7;
	}
</style>
