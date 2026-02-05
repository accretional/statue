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
		subtitle,
		title,
		highlights
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
