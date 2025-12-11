<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';

  interface Review {
    id: number;
    name: string;
    affiliation: string;
    quote: string;
    imageSrc: string;
    thumbnailSrc: string;
  }

  interface Props {
    reviews: Review[];
  }

  let { reviews = [] }: Props = $props();

  let currentIndex = $state(0);
  let intervalId: number | null = null;
  let container: HTMLDivElement;
  let isPaused = $state(false);

  // Spring animation for smooth transitions
  const offset = spring(0, {
    stiffness: 0.1,
    damping: 0.5
  });

  $effect(() => {
    offset.set(-currentIndex * 100);
  });

  function nextSlide() {
    if (!isPaused) {
      currentIndex = (currentIndex + 1) % reviews.length;
    }
  }

  function manualNext() {
    currentIndex = (currentIndex + 1) % reviews.length;
    resetInterval();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    resetInterval();
  }

  function goToSlide(index: number) {
    currentIndex = index;
    resetInterval();
  }

  function resetInterval() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    startInterval();
  }

  function startInterval() {
    intervalId = window.setInterval(nextSlide, 5000);
  }

  function handleMouseEnter() {
    isPaused = true;
  }

  function handleMouseLeave() {
    isPaused = false;
  }

  onMount(() => {
    startInterval();
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<div
  class="testimonial-slider-wrapper"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  role="region"
  aria-label="Customer testimonials"
>
  <div class="slider-container" bind:this={container}>
    <!-- Main slider content -->
    <div class="slides-wrapper" style="transform: translateX({$offset}%)">
      {#each reviews as review (review.id)}
        <div class="slide">
          <div class="content-grid">
            <!-- Image section -->
            <div class="image-section">
              <div class="image-wrapper">
                <img
                  src={review.imageSrc}
                  alt={review.name}
                  class="testimonial-image"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Text section -->
            <div class="text-section">
              <div class="quote-wrapper">
                <svg
                  class="quote-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote class="quote-text">
                  {review.quote}
                </blockquote>
                <div class="author-info">
                  <p class="author-name">{review.name}</p>
                  <p class="author-affiliation">{review.affiliation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Navigation Controls -->
    <div class="navigation-container">
      <!-- Previous Arrow -->
      <button
        onclick={prevSlide}
        class="nav-arrow"
        aria-label="Previous testimonial"
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

      <!-- Dot Indicators -->
      <div class="dots-wrapper">
        {#each reviews as _, dotIndex}
          <button
            onclick={() => goToSlide(dotIndex)}
            class="dot-button"
            class:active={dotIndex === currentIndex}
            aria-label="Go to testimonial {dotIndex + 1}"
            aria-current={dotIndex === currentIndex ? 'true' : 'false'}
          ></button>
        {/each}
      </div>

      <!-- Next Arrow -->
      <button
        onclick={manualNext}
        class="nav-arrow"
        aria-label="Next testimonial"
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
    </div>
  </div>
</div>

<style>
  .testimonial-slider-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    position: relative;
  }

  .slider-container {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .slides-wrapper {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .slide {
    flex: 0 0 100%;
    min-width: 100%;
    padding: 3rem 2rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
  }

  @media (min-width: 768px) {
    .content-grid {
      grid-template-columns: 2fr 3fr;
      gap: 4rem;
    }
  }

  .image-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 2 / 3;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  .testimonial-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .text-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .quote-wrapper {
    position: relative;
  }

  .quote-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1.5rem;
  }

  .quote-text {
    font-size: 1.25rem;
    line-height: 1.8;
    margin: 0 0 2rem 0;
    font-weight: 400;
  }

  @media (min-width: 768px) {
    .quote-text {
      font-size: 1.5rem;
    }
  }

  .author-info {
    margin-top: 1.5rem;
  }

  .author-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }

  .author-affiliation {
    font-size: 0.875rem;
    margin: 0;
  }

  .navigation-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem 1rem;
  }

  .nav-arrow {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.15);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    color: white;
  }

  .nav-arrow:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }

  .arrow-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .dots-wrapper {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .dot-button {
    height: 0.5rem;
    border-radius: 9999px;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.4);
    width: 0.5rem;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  .dot-button:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .dot-button.active {
    background-color: white;
    width: 2rem;
  }

  @media (max-width: 767px) {
    .slide {
      padding: 2rem 1rem;
    }

    .quote-text {
      font-size: 1.125rem;
    }

    .navigation-container {
      gap: 1rem;
      padding: 1.5rem 0.5rem;
    }

    .nav-arrow {
      width: 2rem;
      height: 2rem;
    }

    .arrow-icon {
      width: 1rem;
      height: 1rem;
    }
  }
</style>
