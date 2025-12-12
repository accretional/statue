<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Slide {
    title: string;
    button: string;
    src: string;
  }

  interface Props {
    slides: Slide[];
    height?: string;
  }

  let {
    slides = [],
    height = '600px'
  }: Props = $props();

  let currentIndex = $state(0);
  let isTransitioning = $state(false);
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
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="carousel-wrapper" style="height: {height};" bind:this={carouselElement}>
  <!-- Slides Container -->
  <div class="slides-container">
    {#each slides as slide, index}
      <div
        class="slide-item"
        style="opacity: {index === currentIndex ? 1 : 0}; z-index: {index === currentIndex ? 10 : 0};"
      >
        <!-- Image -->
        <img
          src={slide.src}
          alt={slide.title}
          class="slide-image"
        />

        <!-- Overlay -->
        <div class="slide-overlay"></div>

        <!-- Content -->
        <div class="slide-content">
          <h2 class="slide-title">
            {slide.title}
          </h2>
          <button class="slide-button">
            {slide.button}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Navigation Arrows -->
  <button
    onclick={prevSlide}
    disabled={isTransitioning}
    class="nav-arrow nav-arrow-left"
    aria-label="Previous slide"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="arrow-icon"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>

  <button
    onclick={nextSlide}
    disabled={isTransitioning}
    class="nav-arrow nav-arrow-right"
    aria-label="Next slide"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="arrow-icon"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </button>

  <!-- Dot Indicators -->
  <div class="dots-container">
    {#each slides as _, dotIndex}
      <button
        onclick={() => goToSlide(dotIndex)}
        disabled={isTransitioning}
        class="dot-button"
        class:active={dotIndex === currentIndex}
        aria-label={`Go to slide ${dotIndex + 1}`}
      ></button>
    {/each}
  </div>
</div>

<style>
  .carousel-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .slides-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .slide-item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 0.5s ease-in-out;
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2), transparent);
  }

  .slide-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
  }

  @media (min-width: 768px) {
    .slide-content {
      padding: 4rem;
    }
  }

  .slide-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
  }

  @media (min-width: 768px) {
    .slide-title {
      font-size: 3.75rem;
    }
  }

  .slide-button {
    padding: 0.75rem 1.5rem;
    background-color: white;
    color: black;
    font-weight: 600;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .slide-button:hover {
    background-color: #f3f4f6;
  }

  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 20;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-arrow:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .nav-arrow:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-arrow-left {
    left: 1rem;
  }

  .nav-arrow-right {
    right: 1rem;
  }

  .arrow-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .dots-container {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 20;
  }

  .dot-button {
    height: 0.5rem;
    border-radius: 9999px;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.5);
    width: 0.5rem;
    border: none;
    cursor: pointer;
  }

  .dot-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.7);
  }

  .dot-button.active {
    background-color: white;
    width: 2rem;
  }

  .dot-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
