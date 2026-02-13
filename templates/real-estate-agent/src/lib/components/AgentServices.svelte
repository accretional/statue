<script lang="ts">
	export interface AgentServicesProps {
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
		subtitle = 'What I Do',
		title = 'My Services',
		description = 'Comprehensive real estate services tailored to your needs',
		services = []
	}: AgentServicesProps = $props();
</script>

<section id="services" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			{#each services as service, index}
				<div
					class="p-8 border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/50 transition-colors duration-300 animate-on-scroll animate-fade-up"
					style="animation-delay: {index * 100}ms"
				>
					{#if service.icon}
						<div class="text-[var(--color-primary)] text-2xl mb-4">{service.icon}</div>
					{/if}
					<h3 class="text-white text-xl font-light mb-3">{service.title}</h3>
					<p class="text-gray-400">{service.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
