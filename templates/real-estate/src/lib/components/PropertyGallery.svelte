<script lang="ts">
	export interface GalleryImage {
		url: string;
		caption: string;
	}

	export interface FloorPlanLevel {
		title: string;
		image: string;
		description?: string;
	}

	export interface PropertyGalleryProps {
		title?: string;
		subtitle?: string;
		images?: GalleryImage[];
		floorPlanEnabled?: boolean;
		floorPlanLevels?: FloorPlanLevel[];
		variant?: 'grid' | 'carousel';
	}

	let {
		title = 'Exceptional Spaces',
		subtitle = 'Gallery',
		images = [],
		floorPlanEnabled = false,
		floorPlanLevels = [],
		variant = 'grid'
	}: PropertyGalleryProps = $props();

	// Carousel state
	let carouselContainer: HTMLDivElement;
	let carouselScrollPosition = $state(0);

	// Gallery lightbox state
	let isLightboxOpen = $state(false);
	let currentImageIndex = $state(0);

	// Floor plan modal state
	let isFloorPlanModalOpen = $state(false);
	let currentFloorPlanIndex = $state(0);

	// Gallery lightbox functions
	function openLightbox(index: number) {
		if (images.length > 0) {
			currentImageIndex = index;
			isLightboxOpen = true;
			document.body.style.overflow = 'hidden';
		}
	}

	function closeLightbox() {
		isLightboxOpen = false;
		document.body.style.overflow = '';
	}

	function nextImage() {
		if (images.length === 0) return;
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		if (images.length === 0) return;
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}

	// Floor plan modal functions
	function openFloorPlanModal(index: number) {
		currentFloorPlanIndex = index;
		isFloorPlanModalOpen = true;
		document.body.style.overflow = 'hidden';
	}

	function closeFloorPlanModal() {
		isFloorPlanModalOpen = false;
		document.body.style.overflow = '';
	}

	function nextFloorPlan() {
		if (floorPlanLevels.length === 0) return;
		currentFloorPlanIndex = (currentFloorPlanIndex + 1) % floorPlanLevels.length;
	}

	function prevFloorPlan() {
		if (floorPlanLevels.length === 0) return;
		currentFloorPlanIndex = (currentFloorPlanIndex - 1 + floorPlanLevels.length) % floorPlanLevels.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (isLightboxOpen) {
			if (e.key === 'Escape') closeLightbox();
			if (e.key === 'ArrowRight') nextImage();
			if (e.key === 'ArrowLeft') prevImage();
		}
		if (isFloorPlanModalOpen) {
			if (e.key === 'Escape') closeFloorPlanModal();
			if (e.key === 'ArrowRight') nextFloorPlan();
			if (e.key === 'ArrowLeft') prevFloorPlan();
		}
	}

	// Carousel scroll functions
	function scrollCarousel(direction: 'left' | 'right') {
		if (!carouselContainer) return;
		const scrollAmount = carouselContainer.clientWidth * 0.8;
		const newPosition = direction === 'left'
			? carouselContainer.scrollLeft - scrollAmount
			: carouselContainer.scrollLeft + scrollAmount;
		carouselContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
	}

	function handleCarouselScroll() {
		if (carouselContainer) {
			carouselScrollPosition = carouselContainer.scrollLeft;
		}
	}

	let canScrollLeft = $derived(carouselScrollPosition > 0);
	let canScrollRight = $derived(
		carouselContainer ? carouselScrollPosition < carouselContainer.scrollWidth - carouselContainer.clientWidth - 10 : true
	);
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Carousel Gallery (Multi-unit) -->
{#if variant === 'carousel' && images.length > 0}
	<section id="gallery" class="py-16">
		<!-- Title -->
		<div class="text-center mb-8 px-4">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

		<!-- Full-width Carousel -->
		<div class="relative">
			<!-- Left Arrow -->
			<button
				onclick={() => scrollCarousel('left')}
				class="cursor-pointer absolute left-0 top-0 bottom-0 z-10 w-20 md:w-32 flex items-center justify-center bg-gradient-to-r from-black/90 via-black/50 to-transparent text-white transition-all duration-300 {canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
				disabled={!canScrollLeft}
				aria-label="Previous images"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>

			<!-- Right Arrow -->
			<button
				onclick={() => scrollCarousel('right')}
				class="cursor-pointer absolute right-0 top-0 bottom-0 z-10 w-20 md:w-32 flex items-center justify-center bg-gradient-to-l from-black/90 via-black/50 to-transparent text-white transition-all duration-300 {canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
				disabled={!canScrollRight}
				aria-label="Next images"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>

			<!-- Carousel Container -->
			<div
				bind:this={carouselContainer}
				onscroll={handleCarouselScroll}
				class="flex gap-1 overflow-x-auto scroll-smooth scrollbar-hide"
				style="scroll-snap-type: x mandatory;"
			>
				{#each images as image, index}
					<button
						class="shrink-0 cursor-pointer group"
						style="scroll-snap-align: start; width: calc(50vw - 2px);"
						onclick={() => openLightbox(index)}
						type="button"
					>
						<div class="relative overflow-hidden h-[50vh] md:h-[60vh] lg:h-[70vh]">
							<img
								src={image.url}
								alt={image.caption}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>
							<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
						</div>
					</button>
				{/each}
			</div>

			<!-- Image counter -->
			<div class="text-center mt-4 text-gray-400 text-sm">
				{images.length} photos
			</div>
		</div>
	</section>

<!-- Grid Gallery (Single-unit) -->
{:else}
	<section id="gallery" class="py-32 px-4">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-16 animate-on-scroll animate-fade-up">
				<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
				<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
			</div>

			{#if images.length === 0}
				<div class="text-center text-gray-500 py-16">
					<p class="text-lg">No images available</p>
				</div>
			{:else}
				{@const displayImages = images.slice(0, 6)}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each displayImages as image, index}
						<button
							class="animate-on-scroll animate-scale cursor-pointer text-left"
							style:transition-delay="{index * 0.1}s"
							onclick={() => openLightbox(index)}
							type="button"
						>
							<div class="relative overflow-hidden group">
								<img
									src={image.url}
									alt={image.caption}
									class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
							</div>
							<p class="text-white text-xs tracking-wider uppercase mt-3 text-center">
								{image.caption}
							</p>
						</button>
					{/each}
				</div>
				{#if images.length > 6}
					<p class="text-center text-gray-500 text-sm mt-6">
						+{images.length - 6} more images available in gallery
					</p>
				{/if}
			{/if}

			<!-- Floor Plan Section -->
			{#if floorPlanEnabled && floorPlanLevels.length > 0}
				<div class="mt-24 animate-on-scroll animate-fade-up">
					<div class="text-center mb-12">
						<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">Floor Plan</p>
						<h3 class="text-3xl md:text-4xl font-light text-white">Explore the Layout</h3>
					</div>
					<div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
						{#each floorPlanLevels as level, index}
							<button
								class="animate-on-scroll animate-fade-up text-left cursor-pointer group"
								style:transition-delay="{index * 0.1}s"
								onclick={() => openFloorPlanModal(index)}
								type="button"
							>
								<div class="border border-[var(--color-border)] p-4 bg-[var(--color-card)] hover:border-[var(--color-primary)] transition-colors duration-300">
									<div class="relative overflow-hidden">
										<img
											src={level.image}
											alt={level.title || 'Floor Plan'}
											class="w-full h-48 object-contain bg-white/5 group-hover:scale-105 transition-transform duration-500"
										/>
										<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
											<span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm tracking-wider uppercase">
												Click to enlarge
											</span>
										</div>
									</div>
									{#if level.title}
										<p class="text-white text-sm font-light mt-4 text-center">{level.title}</p>
									{/if}
									{#if level.description}
										<p class="text-gray-500 text-xs mt-1 text-center">{level.description}</p>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- Gallery Lightbox Modal -->
{#if isLightboxOpen && images.length > 0}
	<div
		class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
		onclick={closeLightbox}
		role="presentation"
	>
		<div
			class="relative w-full h-full flex flex-col items-center justify-center"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<button
				onclick={closeLightbox}
				class="absolute top-4 right-4 text-white hover:text-[var(--color-primary)] transition-colors z-10"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<div class="absolute top-4 left-4 text-white text-sm z-10">
				{currentImageIndex + 1} / {images.length}
			</div>

			<div class="relative max-w-6xl max-h-[80vh] mx-auto px-16">
				<img
					src={images[currentImageIndex].url}
					alt={images[currentImageIndex].caption}
					class="max-w-full max-h-[80vh] object-contain"
				/>
			</div>

			<p class="text-white text-sm mt-4 tracking-wider uppercase">
				{images[currentImageIndex].caption}
			</p>

			{#if images.length > 1}
				<button
					onclick={prevImage}
					class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Previous image"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<button
					onclick={nextImage}
					class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Next image"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}

<!-- Floor Plan Modal -->
{#if isFloorPlanModalOpen && floorPlanLevels.length > 0}
	<div
		class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
		onclick={closeFloorPlanModal}
		role="presentation"
	>
		<div
			class="relative w-full h-full flex flex-col items-center justify-center"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<button
				onclick={closeFloorPlanModal}
				class="absolute top-4 right-4 text-white hover:text-[var(--color-primary)] transition-colors z-10"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			{#if floorPlanLevels.length > 1}
				<div class="absolute top-4 left-4 text-white text-sm z-10">
					{currentFloorPlanIndex + 1} / {floorPlanLevels.length}
				</div>
			{/if}

			<div class="relative max-w-5xl max-h-[85vh] mx-auto px-16">
				<div class="bg-white/5 p-4 rounded">
					<img
						src={floorPlanLevels[currentFloorPlanIndex].image}
						alt={floorPlanLevels[currentFloorPlanIndex].title || 'Floor Plan'}
						class="max-w-full max-h-[70vh] object-contain mx-auto"
					/>
				</div>
			</div>

			<div class="mt-4 text-center">
				{#if floorPlanLevels[currentFloorPlanIndex].title}
					<p class="text-white text-lg font-light tracking-wider">
						{floorPlanLevels[currentFloorPlanIndex].title}
					</p>
				{/if}
				{#if floorPlanLevels[currentFloorPlanIndex].description}
					<p class="text-gray-400 text-sm mt-1">
						{floorPlanLevels[currentFloorPlanIndex].description}
					</p>
				{/if}
			</div>

			{#if floorPlanLevels.length > 1}
				<button
					onclick={prevFloorPlan}
					class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Previous floor plan"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<button
					onclick={nextFloorPlan}
					class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Next floor plan"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}

	/* Hide scrollbar for carousel */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
