<script lang="ts">
	export interface AgentAboutProps {
		subtitle?: string;
		title?: string;
		bio?: string;
		stats?: Array<{
			value: string;
			label: string;
		}>;
		specialties?: Array<{
			title: string;
			description: string;
			icon?: string;
		}>;
	}

	let {
		subtitle = 'About Me',
		title = 'Your Real Estate Partner',
		bio = 'With over 10 years of experience in the Bay Area real estate market, I\'ve helped hundreds of families find their dream homes. My approach combines deep local knowledge with a commitment to exceptional service.',
		stats = [
			{ value: '150+', label: 'Homes Sold' },
			{ value: '$85M', label: 'Total Sales' },
			{ value: '98%', label: 'Client Satisfaction' },
			{ value: '10+', label: 'Years Experience' }
		],
		specialties = []
	}: AgentAboutProps = $props();
</script>

<section id="about" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-6">{title}</h2>
			<p class="text-gray-400 max-w-3xl mx-auto text-lg">{bio}</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
			{#each stats as stat, index}
				<div
					class="text-center animate-on-scroll animate-fade-up"
					style="animation-delay: {index * 100}ms"
				>
					<p class="text-3xl md:text-4xl text-[var(--color-primary)] font-light mb-2">{stat.value}</p>
					<p class="text-gray-400 text-sm">{stat.label}</p>
				</div>
			{/each}
		</div>

		<!-- Specialties (if provided) -->
		{#if specialties.length > 0}
			<div class="grid md:grid-cols-3 gap-8">
				{#each specialties as specialty, index}
					<div
						class="p-6 border border-[var(--color-border)] bg-[var(--color-background)] rounded-lg animate-on-scroll animate-fade-up"
						style="animation-delay: {(index + 4) * 100}ms"
					>
						{#if specialty.icon}
							<div class="text-[var(--color-primary)] text-2xl mb-4">{specialty.icon}</div>
						{/if}
						<h3 class="text-white text-lg font-medium mb-2">{specialty.title}</h3>
						<p class="text-gray-400 text-sm">{specialty.description}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
