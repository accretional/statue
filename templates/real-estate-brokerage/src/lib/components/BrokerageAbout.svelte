<script lang="ts">
	export interface BrokerageAboutProps {
		subtitle?: string;
		title?: string;
		description?: string;
		image?: string;
		highlights?: Array<{
			title: string;
			description: string;
		}>;
	}

	let {
		subtitle = 'About Us',
		title = 'A Legacy of Excellence',
		description = 'Founded in 1985, Prestige Realty Group has built an unmatched reputation for delivering exceptional real estate services. Our team of dedicated professionals combines deep market expertise with a client-first philosophy.',
		image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
		highlights = [
			{
				title: 'Client-Centered Approach',
				description: 'Every decision we make is guided by what is best for our clients.'
			},
			{
				title: 'Market Leadership',
				description: 'Recognized as the top brokerage in our primary markets for over a decade.'
			},
			{
				title: 'Innovation & Technology',
				description: 'Leveraging cutting-edge tools to provide superior service and insights.'
			}
		]
	}: BrokerageAboutProps = $props();
</script>

<section id="about" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-7xl mx-auto">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<!-- Image -->
			<div class="animate-on-scroll animate-fade-right">
				<div class="relative">
					<div class="absolute inset-0 bg-[var(--color-primary)]/20 transform translate-x-4 translate-y-4"></div>
					<img
						src={image}
						alt="Our office"
						class="relative z-10 w-full aspect-[4/3] object-cover"
					/>
				</div>
			</div>

			<!-- Content -->
			<div class="animate-on-scroll animate-fade-left">
				<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
				<h2 class="text-3xl md:text-4xl font-light text-white mb-6">{title}</h2>
				<p class="text-gray-400 text-lg mb-10 leading-relaxed">{description}</p>

				<div class="space-y-6">
					{#each highlights as highlight, index}
						<div class="flex gap-4" style="animation-delay: {index * 100}ms">
							<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[var(--color-primary)] text-[var(--color-primary)]">
								<span class="text-sm">0{index + 1}</span>
							</div>
							<div>
								<h3 class="text-white font-medium mb-1">{highlight.title}</h3>
								<p class="text-gray-400 text-sm">{highlight.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
