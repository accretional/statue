<svelte:head>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

<script>
  import { NavigationBar } from 'statue-ssg';
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import '$lib/index.css';

  export let data;

  $: navbarConfig = data?.navbarConfig;
  $: searchConfig = data?.searchConfig;

  // Enable View Transitions API for Hero-like animations
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });

      // Reset scroll position after transition completes
      transition.finished.then(() => {
        window.scrollTo(0, 0);
      });
    });
  });
</script>

<NavigationBar
  navbarItems={data?.globalDirectories ?? []}
  showSearch={searchConfig?.enabled ?? false}
  searchPlaceholder={searchConfig?.placeholder ?? 'Search...'}
  siteTitle={navbarConfig?.siteTitle ?? null}
  logo={navbarConfig?.logo ?? null}
  hiddenFromNav={navbarConfig?.hiddenFromNav ?? []}
  defaultNavItems={navbarConfig?.defaultNavItems}
/>

<main class="pt-16">
  <slot />
</main>

<!-- Footer -->
<footer class="site-footer">
  <a href="https://statue.dev" target="_blank" rel="noopener noreferrer" class="footer-link">
    Created with statue.dev
  </a>
</footer>

<style>
  :global(body) {
    background-color: var(--color-background);
    font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    margin: 0;
    padding: 0;
    color: var(--color-foreground);
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  /* View Transitions - Hero animation */
  :global(::view-transition-old(resume-pdf)),
  :global(::view-transition-new(resume-pdf)) {
    animation-duration: 0.8s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(::view-transition-old(root)),
  :global(::view-transition-new(root)) {
    animation-duration: 0.5s;
  }

  /* Timeline Hero Dot - stays circular */
  :global(::view-transition-group(timeline-hero)) {
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(::view-transition-old(timeline-hero)),
  :global(::view-transition-new(timeline-hero)) {
    border-radius: 50%;
    mix-blend-mode: normal;
  }

  :global(::view-transition-old(timeline-hero)) {
    animation: hero-fly-out 0.5s ease-in-out;
  }

  :global(::view-transition-new(timeline-hero)) {
    animation: hero-fly-in 0.5s ease-in-out;
  }

  @keyframes hero-fly-out {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(2); }
  }

  @keyframes hero-fly-in {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }

  /* Footer */
  .site-footer {
    padding: 2rem 1rem;
    text-align: center;
    border-top: 1px solid var(--color-border);
    margin-top: 3rem;
  }

  .footer-link {
    color: var(--color-muted);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s ease;
  }

  .footer-link:hover {
    color: var(--color-primary);
  }

  /* Hide footer on github1s and repositoriespage */
  :global(body.github1s-page) .site-footer,
  :global(body.repositories-page) .site-footer {
    display: none;
  }

  /* Mac Desktop Hero Transition */
  :global(::view-transition-group(mac-hero)) {
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(::view-transition-old(mac-hero)) {
    animation: mac-hero-expand 0.6s ease-out forwards;
  }

  :global(::view-transition-new(mac-hero)) {
    animation: mac-hero-reveal 0.6s ease-out forwards;
  }

  @keyframes mac-hero-expand {
    0% {
      opacity: 1;
      transform: scale(1);
      border-radius: 16px;
    }
    100% {
      opacity: 0;
      transform: scale(30);
      border-radius: 0;
    }
  }

  @keyframes mac-hero-reveal {
    0% {
      opacity: 0;
      clip-path: circle(0% at calc(100% - 4rem) calc(100% - 4rem));
    }
    100% {
      opacity: 1;
      clip-path: circle(150% at calc(100% - 4rem) calc(100% - 4rem));
    }
  }
</style>
