<script lang="ts">
	export interface AgentTestimonialsProps {
		subtitle?: string;
		title?: string;
		testimonials?: Array<{
			name: string;
			location?: string;
			text: string;
			deal?: string;
			rating?: number;
		}>;
	}

	let {
		subtitle = 'Testimonials',
		title = 'What Clients Say',
		testimonials = []
	}: AgentTestimonialsProps = $props();
</script>

<section id="testimonials" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white">{title}</h2>
		</div>

		{#if testimonials.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each testimonials as testimonial, index}
					<div
						class="p-8 bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors duration-300 animate-on-scroll animate-fade-up"
						style="animation-delay: {index * 100}ms"
					>
						<!-- Rating -->
						{#if testimonial.rating}
							<div class="flex gap-1 mb-4">
								{#each Array(testimonial.rating) as _}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-[var(--color-primary)]">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
									</svg>
								{/each}
							</div>
						{/if}

						<!-- Quote -->
						<p class="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

						<!-- Author -->
						<div>
							<p class="text-white font-medium">{testimonial.name}</p>
							{#if testimonial.location}
								<p class="text-gray-500 text-sm">{testimonial.location}</p>
							{/if}
							{#if testimonial.deal}
								<p class="text-[var(--color-primary)] text-xs mt-1">{testimonial.deal}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">Client testimonials coming soon!</p>
			</div>
		{/if}
	</div>
</section>
