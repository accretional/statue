<script lang="ts">
  import { onMount } from 'svelte';
  
  interface CompareProps {
    firstImage?: string;
    secondImage?: string;
    className?: string;
    firstImageClassName?: string;
    secondImageClassname?: string;
    initialSliderPercentage?: number;
    slideMode?: 'hover' | 'drag';
    showHandlebar?: boolean;
    autoplay?: boolean;
    autoplayDuration?: number;
    height?: string; // New prop for custom height
  }
  
  let {
    firstImage = '',
    secondImage = '',
    className = '',
    firstImageClassName = '',
    secondImageClassname = '',
    initialSliderPercentage = 50,
    slideMode = 'drag',
    showHandlebar = true,
    autoplay = false,
    autoplayDuration = 5000,
    height = '600px' // Default height
  }: CompareProps = $props();
  
  let sliderXPercent = $state(50);
  let isDragging = $state(false);
  let containerRef: HTMLDivElement | null = $state(null);
  let intervalRef: number | null = $state(null);

  const isMouseEntered = $state({ value: false });

  onMount(() => {
    sliderXPercent = initialSliderPercentage;

    if (autoplay) {
      startAutoplay();
    }

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  });
  
  function startAutoplay() {
    if (intervalRef) {
      clearInterval(intervalRef);
    }
    
    intervalRef = window.setInterval(() => {
      if (sliderXPercent < 100) {
        sliderXPercent = sliderXPercent + 1;
      } else {
        sliderXPercent = 0;
      }
    }, autoplayDuration / 100);
  }
  
  function stopAutoplay() {
    if (intervalRef) {
      clearInterval(intervalRef);
      intervalRef = null;
    }
  }
  
  function handleStart(clientX: number) {
    if (slideMode === 'hover') return;
    
    isDragging = true;
    updateSliderPosition(clientX);
    
    if (autoplay) {
      stopAutoplay();
    }
  }
  
  function handleEnd() {
    if (slideMode === 'hover') return;
    
    isDragging = false;
    
    if (autoplay) {
      startAutoplay();
    }
  }
  
  function handleMove(clientX: number) {
    if (!isDragging && slideMode === 'drag') return;
    updateSliderPosition(clientX);
  }
  
  function updateSliderPosition(clientX: number) {
    if (!containerRef) return;
    
    const rect = containerRef.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    
    sliderXPercent = Math.max(0, Math.min(100, percent));
  }
  
  function handleMouseDown(e: MouseEvent) {
    handleStart(e.clientX);
  }
  
  function handleMouseUp() {
    handleEnd();
  }
  
  function handleMouseMove(e: MouseEvent) {
    handleMove(e.clientX);
  }
  
  function handleMouseEnter() {
    isMouseEntered.value = true;
  }
  
  function handleMouseLeave() {
    isMouseEntered.value = false;
    if (slideMode === 'drag' && isDragging) {
      handleEnd();
    }
  }
  
  function handleTouchStart(e: TouchEvent) {
    handleStart(e.touches[0].clientX);
  }
  
  function handleTouchEnd() {
    handleEnd();
  }
  
  function handleTouchMove(e: TouchEvent) {
    handleMove(e.touches[0].clientX);
  }
</script>

<svelte:window
  onmouseup={handleMouseUp}
  onmousemove={handleMouseMove}
/>

<div
  bind:this={containerRef}
  class="w-full relative overflow-hidden {className}"
  style="height: {height};"
  onmousedown={handleMouseDown}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  ontouchmove={handleTouchMove}
  role="presentation"
>
  <!-- First Image (Bottom Layer) -->
  <img
    src={secondImage}
    alt="Second comparison"
    class="absolute inset-0 w-full h-full object-cover select-none {secondImageClassname}"
    draggable="false"
  />
  
  <!-- Second Image (Top Layer with Clip) -->
  <div
    class="absolute inset-0 w-full h-full select-none"
    style="clip-path: inset(0 {100 - sliderXPercent}% 0 0);"
  >
    <img
      src={firstImage}
      alt="First comparison"
      class="absolute inset-0 w-full h-full object-cover {firstImageClassName}"
      draggable="false"
    />
  </div>
  
  <!-- Slider Line and Handle -->
  {#if showHandlebar}
    <div
      class="slider-line"
      style="left: {sliderXPercent}%;"
    >
      <div class="slider-handle">
        <svg
          class="handle-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      </div>
    </div>
  {/if}
</div>

<style>
  .slider-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--color-primary);
    cursor: ew-resize;
    transform: translateX(-50%);
    transition: width 0.2s ease;
  }

  .slider-line:hover {
    width: 6px;
  }

  .slider-handle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(--color-primary);
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .slider-line:hover .slider-handle {
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }

  .slider-line:active .slider-handle {
    transform: translate(-50%, -50%) scale(1.05);
  }

  .handle-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-on-primary);
    opacity: 0.9;
    transition: opacity 0.2s ease;
  }

  .slider-line:hover .handle-icon {
    opacity: 1;
  }
</style>
