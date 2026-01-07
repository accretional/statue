<script>

  import { page } from '$app/stores';
  import Search from './Search.svelte';

  export let navbarItems = [];
  export let activePath = '';
  export let showSearch = false;
  export let searchPlaceholder = "Search...";

  // Customizable site branding
  export let siteTitle = null;
  export let logo = null; // Can be image URL string or null for default SVG

  // Default navigation items (Home, About, etc.)
  // Set to empty array to hide all default links
  export let defaultNavItems = [
    { title: 'Home', url: '/' }
  ];

  // Hide specific directories from navbar (by folder name)
  export let hiddenFromNav = [];

  // Filter navbarItems based on hiddenFromNav
  $: filteredNavbarItems = navbarItems.filter(item => !hiddenFromNav.includes(item.name));

  let isMenuOpen = false;
  let isHidden = false;
  let lastScrollY = 0;
  let scrollY = 0;

  // Reactive current path from SvelteKit store
  $: currentPath = $page.url.pathname;

  // Find first CTA item from nav items (only first one is used)
  $: ctaItem = [...defaultNavItems, ...filteredNavbarItems].find(item => item.cta);

  // Check if a nav item is active (exact match for home, startsWith for others)
  function isActive(itemUrl, path) {
    if (itemUrl === '/') {
      return path === '/';
    }
    return path === itemUrl || path.startsWith(itemUrl + '/');
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScroll() {
    const currentY = window.scrollY || 0;
    scrollY = currentY;
    const delta = currentY - lastScrollY;
    // Hide on scroll down, show on scroll up
    if (Math.abs(delta) > 6) {
      isHidden = delta > 0 && currentY > 24;
      lastScrollY = currentY;
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
</script>

<nav class="bg-[var(--color-background)] {currentPath === '/' && !isMenuOpen && scrollY < 10 ? 'md:!bg-transparent' : ''} text-[var(--color-foreground)] fixed w-full top-0 z-50 transition-transform duration-300 will-change-transform {isHidden ? '-translate-y-full' : 'translate-y-0'}" style="view-transition-name: navbar;">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <!-- Logo: true = default SVG, string = custom image, false/null = no logo -->
          {#if logo === true}
            <div class="text-[var(--color-primary)] w-8 h-8">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          {:else if logo}
            <img src={logo} alt={siteTitle || 'Logo'} class="w-8 h-8 object-contain" />
          {/if}
          {#if siteTitle}
            <span class="font-bold text-xl text-[var(--color-foreground)]">
              {siteTitle}
            </span>
          {/if}
        </a>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        {#each defaultNavItems as item}
          {#if !item.cta}
            <a
              href={item.url}
              class="py-2 px-3 font-medium text-sm transition-colors duration-200 {isActive(item.url, currentPath) ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}

        {#each filteredNavbarItems as item}
          {#if !item.cta}
            <a
              href={item.url}
              class="py-2 px-3 font-medium text-sm transition-colors duration-200 {isActive(item.url, currentPath) ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}

        <!-- Search component -->
        {#if showSearch}
          <div class="ml-2 w-56">
            <Search placeholder={searchPlaceholder} />
          </div>
        {/if}

        {#if ctaItem}
          <a href={ctaItem.url} class="ml-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] text-sm font-medium transition-colors duration-200">
            {ctaItem.title}
          </a>
        {/if}
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button on:click={toggleMenu} class="text-[var(--color-muted)] hover:text-[var(--color-primary)] focus:outline-none">
          {#if isMenuOpen}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="md:hidden bg-[var(--color-background)]">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Search in mobile menu -->
        {#if showSearch}
          <div class="px-3 py-2">
            <Search placeholder={searchPlaceholder} />
          </div>
        {/if}

        {#each defaultNavItems as item}
          {#if !item.cta}
            <a
              href={item.url}
              class="block px-3 py-2 rounded-md text-base font-medium {isActive(item.url, currentPath) ? 'bg-surface text-white' : 'text-slate-300 hover:bg-surface hover:text-white'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}

        {#each filteredNavbarItems as item}
          {#if !item.cta}
            <a
              href={item.url}
              class="block px-3 py-2 rounded-md text-base font-medium {isActive(item.url, currentPath) ? 'bg-surface text-white' : 'text-slate-300 hover:bg-surface hover:text-white'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}

        {#if ctaItem}
          <a href={ctaItem.url} class="block px-3 py-2 rounded-md text-base font-medium bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] mt-3">
            {ctaItem.title}
          </a>
        {/if}
      </div>
    </div>
  {/if}
</nav>

