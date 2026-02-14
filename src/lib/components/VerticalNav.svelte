<!--
  VerticalNav - Fixed left-side vertical navigation with scroll-based active section highlighting

  Usage:
  ```svelte
  <script>
    import VerticalNav from 'statue-ssg/components/VerticalNav.svelte';

    const sections = [
      { id: 'intro', label: 'Introduction' },
      { id: 'features', label: 'Features' },
      { id: 'pricing', label: 'Pricing' }
    ];
  </script>

  <VerticalNav {sections} />
  ```

  Props:
  - sections: Array of section objects with { id, label }
-->

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';

  export interface VerticalNavProps {
    sections: Array<{
      id: string;
      label: string;
    }>;
  }

  let {
    sections = []
  }: VerticalNavProps = $props();

  let activeId = $state('');
  let observer: IntersectionObserver | undefined;
  let isScrolling = false; // Flag to prevent observer updates during programmatic scroll
  let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

  // Setup observer when sections change
  $effect(() => {
    if (browser && sections.length > 0) {
      setupObserver();
    }
  });

  async function setupObserver() {
    await tick(); // Wait for DOM to update

    // Disconnect previous observer
    if (observer) {
      observer.disconnect();
    }

    // Create new intersection observer
    observer = new IntersectionObserver(
      (entries) => {
        // Skip updates while programmatically scrolling to prevent flicker
        if (isScrolling) return;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer!.observe(element);
      }
    });
  }

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  });

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      // Disable observer updates during scroll animation
      isScrolling = true;
      
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      history.pushState(null, '', `#${id}`);
      activeId = id;
      
      // Re-enable observer after scroll animation completes
      // 600ms is typically enough for smooth scroll to finish
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 600);
    }
  }
</script>

{#if sections.length > 0}
  <nav class="vertical-nav">
    <ul class="nav-list">
      {#each sections as section}
        <li class="nav-item">
          <button
            on:click={() => scrollToSection(section.id)}
            class="nav-link"
            class:active={activeId === section.id}
          >
            <span class="nav-text">{section.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .vertical-nav {
    position: fixed;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    pointer-events: none;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .nav-item {
    pointer-events: auto;
    position: relative;
  }

  .nav-link {
    display: block;
    text-decoration: none;
    background: none;
    border: none;
    color: color-mix(in srgb, var(--color-muted) 60%, transparent);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s ease;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 0.6rem 0.4rem;
    position: relative;
    cursor: pointer;
    border-left: 2px solid transparent;
  }

  .nav-link:hover {
    color: color-mix(in srgb, var(--color-foreground) 80%, transparent);
  }

  .nav-link.active {
    color: var(--color-foreground);
    font-weight: 600;
    border-left-color: var(--color-primary);
  }

  .nav-link.active::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      var(--color-primary) 20%,
      var(--color-primary) 80%,
      transparent 100%
    );
    box-shadow: 0 0 8px color-mix(in srgb, var(--color-primary) 50%, transparent);
  }

  .nav-text {
    display: inline-block;
  }

  /* Responsive: Hide on smaller screens */
  @media (max-width: 1100px) {
    .vertical-nav {
      display: none;
    }
  }

  /* Adjust position on larger screens */
  @media (min-width: 1600px) {
    .vertical-nav {
      left: 2.5rem;
    }
  }
</style>
