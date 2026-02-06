<script lang="ts">
	export interface PropertyRentCalculatorProps {
		subtitle?: string;
		title?: string;
		description?: string;
		baseRentPerSf?: number;
		totalSf?: number;
		defaultTerm?: number;
		defaultFreeRent?: number;
		defaultTi?: number;
		defaultEscalation?: number;
	}

	let {
		subtitle = 'Estimate Your Cost',
		title = 'Net Effective Rent Calculator',
		description = 'Calculate your monthly effective rent factoring in free rent, tenant improvements, and annual escalations.',
		baseRentPerSf = 25,
		totalSf = 2500,
		defaultTerm = 5,
		defaultFreeRent = 1,
		defaultTi = 10,
		defaultEscalation = 3
	}: PropertyRentCalculatorProps = $props();

	// Allow editing baseRentPerSf and totalSf
	let editableBaseRent = $state(baseRentPerSf);
	let editableTotalSf = $state(totalSf);

	// Form state
	let term = $state(defaultTerm); // years
	let freeRent = $state(defaultFreeRent); // months
	let ti = $state(defaultTi); // $ per SF
	let escalation = $state(defaultEscalation); // % annual increase

	// Calculated values
	let monthlyBaseRent = $derived((editableBaseRent * editableTotalSf) / 12);
	let monthlyEffectiveRent = $state(0);
	let totalLeaseCost = $state(0);
	let tiAllowance = $state(0);

	function calculate() {
		// TI Allowance (one-time)
		tiAllowance = ti * editableTotalSf;

		// Calculate rent for each year with escalations
		let totalRent = 0;

		for (let year = 0; year < term; year++) {
			const annualRent = editableBaseRent * editableTotalSf * Math.pow(1 + escalation / 100, year);
			totalRent += annualRent;
		}

		// Subtract free rent (first months of first year)
		const freeRentValue = (editableBaseRent * editableTotalSf / 12) * freeRent;
		totalRent -= freeRentValue;

		totalLeaseCost = totalRent;
		monthlyEffectiveRent = totalRent / (term * 12);
	}

	// Initial calculation
	calculate();

	// Recalculate on change
	$effect(() => {
		calculate();
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}
</script>

<section id="rent-calculator" class="py-24 px-4 bg-[var(--color-card)]">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-12 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white">{title}</h2>
			<p class="text-gray-400 mt-4 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<!-- Inputs -->
			<div class="space-y-6 animate-on-scroll animate-fade-left">
				<h3 class="text-white text-lg font-medium mb-6">Lease Terms</h3>

				<!-- Base Rent Input -->
				<div class="p-4 border border-[var(--color-border)] bg-[var(--color-background)]">
					<p class="text-gray-400 text-sm mb-3">Base Rent (per SF / year)</p>
					<div class="flex items-center gap-3">
						<span class="text-white text-lg">$</span>
						<input
							type="number"
							bind:value={editableBaseRent}
							min="1"
							max="200"
							step="1"
							class="flex-1 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded text-white text-2xl font-light cursor-pointer focus:outline-none focus:border-[var(--color-primary)]"
						/>
						<span class="text-gray-400 text-sm">/ SF</span>
					</div>
				</div>

				<!-- Total SF Input -->
				<div class="p-4 border border-[var(--color-border)] bg-[var(--color-background)]">
					<p class="text-gray-400 text-sm mb-3">Total Square Feet</p>
					<div class="flex items-center gap-3">
						<input
							type="number"
							bind:value={editableTotalSf}
							min="100"
							max="50000"
							step="100"
							class="flex-1 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded text-white text-2xl font-light cursor-pointer focus:outline-none focus:border-[var(--color-primary)]"
						/>
						<span class="text-gray-400 text-sm">SF</span>
					</div>
				</div>

				<!-- Term -->
				<div>
					<label for="term" class="block text-white text-sm mb-2">
						Lease Term: <span class="text-[var(--color-primary)]">{term} years</span>
					</label>
					<input
						id="term"
						type="range"
						bind:value={term}
						min="1"
						max="15"
						step="1"
						class="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
					/>
					<div class="flex items-center justify-between text-xs text-gray-500 mt-1">
						<span>1 year</span>
						<input
							type="number"
							bind:value={term}
							min="1"
							max="15"
							step="1"
							class="w-16 px-2 py-1 text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white text-center cursor-pointer"
						/>
						<span>15 years</span>
					</div>
				</div>

				<!-- Free Rent -->
				<div>
					<label for="freeRent" class="block text-white text-sm mb-2">
						Free Rent: <span class="text-[var(--color-primary)]">{freeRent} months</span>
					</label>
					<input
						id="freeRent"
						type="range"
						bind:value={freeRent}
						min="0"
						max="12"
						step="0.5"
						class="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
					/>
					<div class="flex items-center justify-between text-xs text-gray-500 mt-1">
						<span>0 months</span>
						<input
							type="number"
							bind:value={freeRent}
							min="0"
							max="12"
							step="0.5"
							class="w-16 px-2 py-1 text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white text-center cursor-pointer"
						/>
						<span>12 months</span>
					</div>
				</div>

				<!-- TI Allowance -->
				<div>
					<label for="ti" class="block text-white text-sm mb-2">
						TI Allowance: <span class="text-[var(--color-primary)]">{formatCurrency(ti)} / SF</span>
					</label>
					<input
						id="ti"
						type="range"
						bind:value={ti}
						min="0"
						max="100"
						step="1"
						class="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
					/>
					<div class="flex items-center justify-between text-xs text-gray-500 mt-1">
						<span>$0</span>
						<input
							type="number"
							bind:value={ti}
							min="0"
							max="100"
							step="1"
							class="w-16 px-2 py-1 text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white text-center cursor-pointer"
						/>
						<span>$100</span>
					</div>
				</div>

				<!-- Annual Escalation -->
				<div>
					<label for="escalation" class="block text-white text-sm mb-2">
						Annual Escalation: <span class="text-[var(--color-primary)]">{escalation}%</span>
					</label>
					<input
						id="escalation"
						type="range"
						bind:value={escalation}
						min="0"
						max="10"
						step="0.5"
						class="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
					/>
					<div class="flex items-center justify-between text-xs text-gray-500 mt-1">
						<span>0%</span>
						<input
							type="number"
							bind:value={escalation}
							min="0"
							max="10"
							step="0.5"
							class="w-16 px-2 py-1 text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded text-white text-center cursor-pointer"
						/>
						<span>10%</span>
					</div>
				</div>
			</div>

			<!-- Results -->
			<div class="space-y-6 animate-on-scroll animate-fade-right">
				<h3 class="text-white text-lg font-medium mb-6">Estimated Cost</h3>

				<div class="space-y-4">
					<!-- Monthly Base Rent -->
					<div class="p-4 border border-[var(--color-border)] bg-[var(--color-background)]">
						<p class="text-gray-400 text-sm">Monthly Base Rent</p>
						<p class="text-white text-xl font-light">{formatCurrency(monthlyBaseRent)}</p>
					</div>

					<!-- TI Allowance Total -->
					<div class="p-4 border border-[var(--color-border)] bg-[var(--color-background)]">
						<p class="text-gray-400 text-sm">TI Allowance (One-time)</p>
						<p class="text-white text-xl font-light">{formatCurrency(tiAllowance)}</p>
					</div>

					<!-- Monthly Effective Rent -->
					<div class="p-6 border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10">
						<p class="text-[var(--color-primary)] text-sm font-medium mb-2">Monthly Effective Rent</p>
						<p class="text-white text-3xl font-light">{formatCurrency(monthlyEffectiveRent)}</p>
						<p class="text-gray-400 text-xs mt-2">Including free rent & escalations</p>
					</div>

					<!-- Total Lease Cost -->
					<div class="p-4 border border-[var(--color-border)] bg-[var(--color-background)]">
						<p class="text-gray-400 text-sm">Total Lease Cost ({term} years)</p>
						<p class="text-white text-xl font-light">{formatCurrency(totalLeaseCost)}</p>
					</div>
				</div>

				<!-- CTA -->
				<div class="mt-8 p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]">
					<p class="text-gray-300 text-sm mb-3">Ready to discuss your lease?</p>
					<a
						href="#contact"
						class="cursor-pointer inline-block w-full text-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)] transition-colors duration-300 text-sm tracking-wider uppercase"
					>
						Schedule Consultation
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary, #0ea5e9);
		cursor: pointer;
		transition: all 0.2s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary, #0ea5e9);
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.1);
	}

	/* Number input styling */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		opacity: 1;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
