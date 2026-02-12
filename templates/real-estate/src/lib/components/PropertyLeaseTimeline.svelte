<script lang="ts">
	export interface PropertyLeaseTimelineProps {
		subtitle?: string;
		title?: string;
		description?: string;
		steps?: Array<{
			number: number;
			title: string;
			duration: string;
			documents?: string[];
			description: string;
		}>;
	}

	let {
		subtitle = 'The Process',
		title = 'Your Journey to a New Office',
		description = 'From your first tour to moving day, we make every step simple and transparent.',
		steps = [
			{
				number: 1,
				title: 'Tour',
				duration: '1-2 hours',
				documents: ['Valid ID (government issued)'],
				description: 'Visit the space, see the amenities, and envision your business here. We\'ll answer all your questions and discuss your specific needs.'
			},
			{
				number: 2,
				title: 'Proposal',
				duration: '1-3 business days',
				documents: ['Space requirements', 'Budget range', 'Target move-in date'],
				description: 'We\'ll prepare a custom proposal with space options, pricing, and lease terms tailored to your business needs.'
			},
			{
				number: 3,
				title: 'LOI (Letter of Intent)',
				duration: '3-7 business days',
				documents: ['Business information', 'Financial statements', 'Entity documents'],
				description: 'Review and sign the Letter of Intent outlining key terms. This non-binding agreement sets the foundation for the lease.'
			},
			{
				number: 4,
				title: 'Lease Execution',
				duration: '7-14 business days',
				documents: ['Signed lease agreement', 'Certificate of insurance', 'Security deposit'],
				description: 'Finalize the lease agreement, complete the application, and submit required documentation. We handle the paperwork efficiently.'
			},
			{
				number: 5,
				title: 'Move-In',
				duration: '1 day',
				documents: ['Move-in checklist', 'Keys & access cards', 'Welcome packet'],
				description: 'Receive your keys, access codes, and welcome packet. Your office is ready—start working from day one.'
			}
		]
	}: PropertyLeaseTimelineProps = $props();
</script>

<section id="lease-timeline" class="py-24 px-4 bg-[var(--color-background)]">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="relative">
			<!-- Vertical Line (Desktop) -->
			<div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/50 to-transparent top-0 bottom-0"></div>

			<!-- Steps -->
			<div class="space-y-12">
				{#each steps as step, index}
					<div
						class="relative animate-on-scroll animate-fade-up"
						style="animation-delay: {index * 100}ms"
					>
						<!-- Desktop Layout -->
						<div class="hidden md:grid md:grid-cols-2 md:gap-8 md:items-center">
							<!-- Left Side -->
							<div class="text-right pr-12 {index % 2 === 1 ? 'md:order-2' : ''}">
								<div class="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-lg">
									<h3 class="text-white text-xl font-light mb-2">
										<span class="text-[var(--color-primary)] font-medium">Step {step.number}:</span> {step.title}
									</h3>
									<p class="text-gray-300 mb-4">{step.description}</p>
									<div class="flex items-center justify-end gap-2 mb-4">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-[var(--color-primary)]"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>
										<span class="text-[var(--color-primary)] text-sm font-medium">{step.duration}</span>
									</div>
									{#if step.documents && step.documents.length > 0}
										<div class="border-t border-[var(--color-border)] pt-4">
											<p class="text-gray-400 text-xs uppercase tracking-wider mb-2">Required Documents</p>
											<ul class="space-y-1">
												{#each step.documents as doc}
													<li class="text-gray-400 text-sm flex items-center justify-end gap-2">
														<span>{doc}</span>
														<svg
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															class="text-[var(--color-primary)]"
														>
															<polyline points="20 6 9 17 4 12"></polyline>
														</svg>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								</div>
							</div>

							<!-- Center Dot -->
							<div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
								<div
									class="w-12 h-12 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-background)] flex items-center justify-center text-white font-bold text-lg z-10"
								>
									{step.number}
								</div>
							</div>

							<!-- Right Side (Empty for spacing) -->
							<div class="pl-12 {index % 2 === 1 ? 'md:order-1' : ''}"></div>
						</div>

						<!-- Mobile Layout -->
						<div class="md:hidden">
							<div class="flex gap-4">
								<div class="flex-shrink-0">
									<div
										class="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold"
									>
										{step.number}
									</div>
								</div>
								<div class="flex-1 bg-[var(--color-card)] border border-[var(--color-border)] p-5 rounded-lg">
									<h3 class="text-white text-lg font-light mb-2">
										<span class="text-[var(--color-primary)] font-medium">Step {step.number}:</span> {step.title}
									</h3>
									<p class="text-gray-300 text-sm mb-3">{step.description}</p>
									<div class="flex items-center gap-2 mb-3">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-[var(--color-primary)]"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>
										<span class="text-[var(--color-primary)] text-sm font-medium">{step.duration}</span>
									</div>
									{#if step.documents && step.documents.length > 0}
										<div class="border-t border-[var(--color-border)] pt-3">
											<p class="text-gray-400 text-xs uppercase tracking-wider mb-2">
												Required Documents
											</p>
											<ul class="space-y-1">
												{#each step.documents as doc}
													<li class="text-gray-400 text-sm flex items-center gap-2">
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															class="text-[var(--color-primary)] flex-shrink-0"
														>
															<polyline points="20 6 9 17 4 12"></polyline>
														</svg>
														<span>{doc}</span>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Bottom CTA -->
		<div class="mt-16 text-center animate-on-scroll animate-fade-up">
			<div class="bg-[var(--color-card)] border border-[var(--color-primary)]/30 rounded-lg p-8 max-w-2xl mx-auto">
				<p class="text-gray-300 mb-4">
					<span class="text-[var(--color-primary)] font-medium">Total Timeline:</span> Typically 3-4 weeks from tour to move-in
				</p>
				<p class="text-gray-400 text-sm mb-6">
					We handle all the complexities so you can focus on growing your business. Ready to start?
				</p>
				<a
					href="#contact"
					class="cursor-pointer inline-block px-8 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
				>
					Schedule Your Tour
				</a>
			</div>
		</div>
	</div>
</section>
