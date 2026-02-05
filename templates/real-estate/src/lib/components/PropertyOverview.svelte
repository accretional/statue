<script lang="ts">
	export interface PropertyOverviewProps {
		subtitle?: string;
		title?: string;
		image?: string;
		paragraphs?: string[];
	}

	let {
		subtitle,
		title,
		image,
		paragraphs
	}: PropertyOverviewProps = $props();
</script>

<section class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="grid md:grid-cols-2 gap-16 items-center">
			<div class="animate-on-scroll animate-fade-left">
				<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
				<h2 class="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">{title}</h2>
				{#each paragraphs as paragraph}
					<p class="text-gray-400 text-lg leading-relaxed mb-8">{paragraph}</p>
				{/each}
			</div>
			<div class="animate-on-scroll animate-fade-right">
				<img src={image} alt="Property Interior" class="w-full h-[600px] object-cover" />
			</div>
		</div>
	</div>
</section>
