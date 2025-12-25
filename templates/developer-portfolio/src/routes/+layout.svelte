<script>
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import '$lib/index.css';

  // Navbar items
  const navbarItems = [
    { title: 'Blog', url: '/blog' },
    { title: 'Docs', url: '/docs' }
  ];

  let scrollY = 0;

  $: currentPath = $page.url.pathname;

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

<svelte:window bind:scrollY />

<!-- Custom Navbar -->
<nav class="navbar" class:scrolled={scrollY > 10}>
  <div class="nav-container">
    <a href="/" class="logo">
      <span class="logo-text">My Name</span>
    </a>

    <div class="nav-links">
      <a href="/" class="nav-link" class:active={currentPath === '/'}>Home</a>
      {#each navbarItems as item}
        <a href={item.url} class="nav-link" class:active={currentPath.startsWith(item.url)}>{item.title}</a>
      {/each}
    </div>
  </div>
</nav>

<main class="pt-16">
  <slot />
</main>

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

  /* Custom Navbar Styles */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 50;
    background: transparent;
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }

  .navbar.scrolled {
    background: var(--glass-bg, rgba(0, 0, 0, 0.8));
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    color: var(--color-foreground);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 6px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .nav-link:hover {
    color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  }

  .nav-link.active {
    color: var(--color-primary);
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
