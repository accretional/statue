<!--
  TableOfContents - "On this page" sidebar component for documentation

  Usage:
  ```svelte
  <script>
    import TableOfContents from 'statue-ssg/components/TableOfContents.svelte';

    const headings = [
      { id: 'overview', text: 'Overview', level: 2 },
      { id: 'features', text: 'Features', level: 2 },
      { id: 'content-driven', text: 'Content-driven', level: 3 },
      { id: 'server-first', text: 'Server-first', level: 3 },
      { id: 'installation', text: 'Installation', level: 2 }
    ];
  </script>

  <TableOfContents {headings} />
  ```

  Props:
  - headings: Array of heading objects with { id, text, level }
  - title: Section title (default: 'On this page')
  - activeId: Currently active heading ID for highlighting
-->

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';

  export interface TableOfContentsProps {
    headings: Array<{
      id: string;
      text: string;
      level: number;
    }>;
    title?: string;
  }

  let {
    headings = [],
    title = 'On this page'
  }: TableOfContentsProps = $props();

  let activeId = $state('');
  let observer: IntersectionObserver | undefined;

  // Filter to only show h2 and h3 headings
  let visibleHeadings = $derived(headings.filter(h => h.level === 2 || h.level === 3));

  // Setup observer when headings change
  $effect(() => {
    if (browser && headings.length > 0) {
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

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer!.observe(element);
      }
    });
  }

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
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
    }
  }
</script>

{#if visibleHeadings.length > 0}
  <aside class="toc-sidebar pr-4">
    <h4 class="text-sm font-semibold text-[var(--color-foreground)] mb-4">
      {title}
    </h4>

    <nav class="toc-nav">
      <ul class="space-y-1 border-l border-[var(--color-border)]">
        {#each visibleHeadings as heading}
          <li
            style="padding-left: {(heading.level - 2) * 0.75}rem"
          >
            <button
              on:click={() => scrollToHeading(heading.id)}
              class="block w-full text-left py-1 px-3 text-sm transition-colors border-l-2 -ml-px cursor-pointer
                {activeId === heading.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-medium'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]'}"
            >
              {heading.text}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
{/if}
