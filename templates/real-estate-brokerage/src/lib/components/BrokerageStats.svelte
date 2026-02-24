<script lang="ts">
	export interface BrokerageStatsProps {
		stats?: Array<{
			value: string;
			label: string;
		}>;
	}

	let { stats = [] }: BrokerageStatsProps = $props();
</script>

<section class="py-16 px-4 bg-[var(--color-card)] border-y border-[var(--color-border)]">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each stats as stat, index}
				<div
					class="text-center animate-on-scroll animate-fade-up"
					style="animation-delay: {index * 100}ms"
				>
					<p class="text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary)] font-light mb-2">
						{stat.value}
					</p>
					<p class="text-gray-400 text-sm tracking-wide">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
