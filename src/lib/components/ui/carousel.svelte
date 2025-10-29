<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Slide {
    title: string;
    button: string;
    src: string;
  }
  
  export let slides: Slide[] = [];
  export let height: string = '600px'; // Add height prop with default value
  
  let currentIndex = 0;
  let isTransitioning = false;
  let carouselElement: HTMLDivElement;
  
  function goToSlide(index: number) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }
  
  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }
  
  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      prevSlide();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
    }
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    console.log('Carousel mounted with slides:', slides);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
  
  $: console.log('Current index:', currentIndex);
</script>

<div class="relative w-full overflow-hidden" style="height: {height};" bind:this={carouselElement}>
  <!-- Slides Container -->
  <div class="relative w-full h-full">
    {#each slides as slide, index}
      <div
        class="absolute inset-0 transition-opacity duration-500 ease-in-out"
        style="opacity: {index === currentIndex ? 1 : 0}; z-index: {index === currentIndex ? 10 : 0};"
      >
        <!-- Image -->
        <img
          src={slide.src}
          alt={slide.title}
          class="w-full h-full object-cover"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <!-- Content -->
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-4">
            {slide.title}
          </h2>
          <button
            class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {slide.button}
          </button>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Navigation Arrows -->
  <button
    on:click={prevSlide}
    disabled={isTransitioning}
    class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all disabled:opacity-50 flex items-center justify-center text-white z-20"
    aria-label="Previous slide"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
  
  <button
    on:click={nextSlide}
    disabled={isTransitioning}
    class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all disabled:opacity-50 flex items-center justify-center text-white z-20"
    aria-label="Next slide"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </button>
  
  <!-- Dot Indicators -->
  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
    {#each slides as _, dotIndex}
      <button
        on:click={() => goToSlide(dotIndex)}
        disabled={isTransitioning}
        class="h-2 rounded-full transition-all disabled:opacity-50 {dotIndex === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'}"
        aria-label={`Go to slide ${dotIndex + 1}`}
      />
    {/each}
  </div>
</div>
