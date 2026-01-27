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
</script>

<section id="gallery" class="py-32 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-16 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-4xl md:text-5xl font-light text-white">{title}</h2>
		</div>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each images as image, index}
				<div class="animate-on-scroll animate-scale" style:transition-delay="{index * 0.1}s;">
					<img
						src={image.url}
						alt={image.caption}
						class="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
					/>
					<p class="text-white text-xs tracking-wider uppercase mt-3 text-center">{image.caption}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
