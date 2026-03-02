<script lang="ts">
	export interface BrokerageServicesProps {
		subtitle?: string;
		title?: string;
		description?: string;
		services?: Array<{
			title: string;
			description: string;
			icon?: string;
		}>;
	}

	let {
		subtitle = '',
		title = '',
		description = '',
		services = []
	}: BrokerageServicesProps = $props();
</script>

<section id="services" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each services as service, index}
				<div
					class="group p-8 border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50 transition-all duration-300 animate-on-scroll animate-fade-up"
					style="animation-delay: {index * 100}ms"
				>
					<div class="text-[var(--color-primary)] text-3xl font-light mb-4 opacity-50">
						{service.icon}
					</div>
					<h3
						class="text-white text-xl font-light mb-3 group-hover:text-[var(--color-primary)] transition-colors"
					>
						{service.title}
					</h3>
					<p class="text-gray-400 text-sm leading-relaxed">{service.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
