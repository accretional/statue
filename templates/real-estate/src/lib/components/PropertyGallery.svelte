<script lang="ts">
	export interface GalleryImage {
		url: string;
		caption: string;
	}

	export interface PropertyGalleryProps {
		title?: string;
		subtitle?: string;
		images?: GalleryImage[];
	}

	let {
		title = 'Exceptional Spaces',
		subtitle = 'Gallery',
		images = []
	}: PropertyGalleryProps = $props();

	let isLightboxOpen = $state(false);
	let currentImageIndex = $state(0);

	function openLightbox(index: number) {
		currentImageIndex = index;
		isLightboxOpen = true;
		document.body.style.overflow = 'hidden';
	}

	function closeLightbox() {
		isLightboxOpen = false;
		document.body.style.overflow = '';
	}

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
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
		{#if images.length === 0}
			<div class="text-center text-gray-500 py-16">
				<p class="text-lg">No images available</p>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each images as image, index}
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
								class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
							>
								<span
									class="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								>
									+
								</span>
							</div>
						</div>
						<p class="text-white text-xs tracking-wider uppercase mt-3 text-center">
							{image.caption}
						</p>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Lightbox Modal -->
{#if isLightboxOpen}
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
				class="absolute top-8 right-8 text-white hover:text-[var(--color-primary)] transition-colors z-10 group"
				onclick={closeLightbox}
				type="button"
				aria-label="Close lightbox"
			>
				<svg class="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Main Image -->
			<div class="w-full h-full flex items-center justify-center px-8 py-24">
				{#if images[currentImageIndex]}
					<img
						src={images[currentImageIndex].url}
						alt={images[currentImageIndex].caption}
						class="max-w-4xl max-h-[70vh] w-full h-auto object-contain animate-scale"
					/>
				{/if}
			</div>

			<!-- Image Info -->
			<div class="absolute bottom-8 left-8 right-8 flex items-center justify-between">
				<div class="text-white">
					{#if images[currentImageIndex]}
						<p class="text-sm tracking-wider uppercase font-light">
							{images[currentImageIndex].caption}
						</p>
						<p class="text-xs text-gray-400 mt-1">
							{currentImageIndex + 1} / {images.length}
						</p>
					{/if}
				</div>

				<!-- Navigation Buttons -->
				<div class="flex gap-4">
					<button
						class="text-white hover:text-[var(--color-primary)] transition-colors group"
						onclick={prevImage}
						type="button"
						aria-label="Previous image"
					>
						<svg class="w-8 h-8 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						class="text-white hover:text-[var(--color-primary)] transition-colors group"
						onclick={nextImage}
						type="button"
						aria-label="Next image"
					>
						<svg class="w-8 h-8 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Keyboard Hint -->
			<div class="absolute top-8 left-8 text-gray-500 text-xs tracking-wider hidden md:block">
				<p>← → to navigate • ESC to close</p>
			</div>
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

	:global(.animate-fade-in) {
		animation: fade-in 0.3s ease-out;
	}
</style>
