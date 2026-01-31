<script lang="ts">
	import { onMount } from 'svelte';

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
	}

	let {
		title = 'Exceptional Spaces',
		subtitle = 'Gallery',
		images = [],
		floorPlanEnabled = false,
		floorPlanLevels = []
	}: PropertyGalleryProps = $props();

	let isLightboxOpen = $state(false);
	let currentImageIndex = $state(0);

	// Lightbox functions
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

	function handleKeydown(e: KeyboardEvent) {
		if (!isLightboxOpen) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'ArrowLeft') prevImage();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<section id="gallery" class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>

			<!-- Gallery Section -->
			{#if images.length === 0}
				<div class="text-center text-gray-500 py-16">
					<p class="text-lg">No images available</p>
				</div>
			{:else}
				<!-- Show only first 6 images on page -->
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
								<div
									class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"
								/>
							</div>
							<p class="text-white text-xs tracking-wider uppercase mt-3 text-center">
								{image.caption}
							</p>
						</button>
					{/each}
				</div>
				<!-- Show more indicator if there are additional images -->
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
			{#if floorPlanLevels.length === 0}
				<div class="text-center text-gray-500 py-16">
					<p class="text-lg">No floor plan available</p>
				</div>
			{:else}
				<div class="max-w-4xl mx-auto grid md:grid-cols-1 gap-12">
					{#each floorPlanLevels as level, index}
						<div class="animate-on-scroll animate-fade-up" style:transition-delay="{index * 0.15}s;">
							{#if level.title}
								<h3 class="text-white text-xl font-light mb-4 text-center">{level.title}</h3>
							{/if}
							<div class="border border-[var(--color-border)] p-4 bg-[var(--color-card)]">
								<img
									src={level.image}
									alt={level.title || 'Floor Plan'}
									class="w-full h-auto"
								/>
								{#if level.description}
									<p class="text-gray-400 text-sm mt-4 text-center">{level.description}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
			</div>
		{/if}
	</div>
</section>

<!-- Lightbox Modal -->
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
			<!-- Close Button -->
			<button
				onclick={closeLightbox}
				class="absolute top-4 right-4 text-white hover:text-[var(--color-primary)] transition-colors z-10"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<!-- Image Counter -->
			<div class="absolute top-4 left-4 text-white text-sm z-10">
				{currentImageIndex + 1} / {images.length}
			</div>

			<!-- Main Image -->
			<div class="relative max-w-6xl max-h-[80vh] mx-auto px-16">
				<img
					src={images[currentImageIndex].url}
					alt={images[currentImageIndex].caption}
					class="max-w-full max-h-[80vh] object-contain"
				/>
			</div>

			<!-- Caption -->
			<p class="text-white text-sm mt-4 tracking-wider uppercase">
				{images[currentImageIndex].caption}
			</p>

			<!-- Navigation Buttons -->
			{#if images.length > 1}
				<button
					onclick={prevImage}
					class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Previous image"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<button
					onclick={nextImage}
					class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-primary)] transition-colors"
					aria-label="Next image"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
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
</style>
