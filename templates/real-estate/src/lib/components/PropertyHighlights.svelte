<script lang="ts">
	export interface Highlight {
		title: string;
		description: string;
	}

	export interface PropertyHighlightsProps {
		subtitle?: string;
		title?: string;
		highlights?: Highlight[];
	}

	let {
		subtitle = 'Highlights',
		title = 'Key Features',
		highlights = [
			{ title: 'Prime Location', description: 'Just off Route 59 & 95th St. near downtown, offering easy access to dining, shopping, and major roadways.' },
			{ title: 'Spacious Private Offices', description: 'Large, impressive offices tailored for business professionals.' },
			{ title: 'Abundant Natural Light', description: 'Each office features a sprawling window line flooding the space with natural light.' },
			{ title: 'Move-in Ready', description: 'Immediate availability with leasing options designed to fit your business needs.' }
		]
	}: PropertyHighlightsProps = $props();
</script>

<section id="highlights" class="py-24 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
			{#each highlights as highlight, i}
				<div
					class="border border-[var(--color-border)] p-8 hover:border-[var(--color-primary)] transition-colors duration-300 animate-on-scroll animate-fade-up"
					style:transition-delay="{i * 0.1}s"
				>
					<div class="flex items-start gap-4">
						<span class="text-[var(--color-primary)] text-lg mt-1">◆</span>
						<div>
							<h3 class="text-white text-xl font-light mb-3">{highlight.title}</h3>
							<p class="text-gray-400 leading-relaxed">{highlight.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
