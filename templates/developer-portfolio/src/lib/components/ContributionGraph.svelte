<script lang="ts">
	export let data: {
		total: number;
		days: Array<{
			date: string;
			count: number;
			level: number;
		}>;
	};

	function getLevelColor(level: number): string {
		switch (level) {
			case 1: return 'bg-contribution-1';
			case 2: return 'bg-contribution-2';
			case 3: return 'bg-contribution-3';
			case 4: return 'bg-contribution-4';
			default: return 'bg-contribution-0';
		}
	}

	// Group days into weeks for column layout (7 days per column)
	$: weeks = (() => {
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
</script>

<div class="w-full flex flex-col items-center justify-center">
	<div class="flex gap-[3px]">
		{#each weeks as week, wIndex}
			<div class="flex flex-col gap-[3px]">
				{#each week as day, dIndex}
					<div
						class="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] {day ? getLevelColor(day.level) : 'bg-transparent/0'} transition-all duration-300 hover:scale-125 hover:z-10"
						title={day ? `${day.count} contributions on ${day.date}` : ''}
					></div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="mt-4 text-xs font-mono text-fg-muted opacity-60">
		{data.total} contributions in the last year
	</div>
</div>
