<script>
  export let navbarItems = [];
  export let activePath = '';
  
  let isMenuOpen = false;
  let isHidden = false;
  let lastScrollY = 0;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScroll() {
    const currentY = window.scrollY || 0;
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

<nav class="bg-transparent text-[var(--color-foreground)] fixed w-full top-0 z-50 transition-transform duration-300 will-change-transform {isHidden ? '-translate-y-full' : 'translate-y-0'}">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <!-- Logo icon - custom SVG similar to BotGauge -->
          <div class="text-[var(--color-primary)] w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="font-bold text-xl">
            <span class="text-[var(--color-primary)]">Statue</span>SSG
          </span>
        </a>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <a 
          href="/" 
          class="py-2 px-3 font-medium text-sm transition-colors duration-200 {activePath === '/' ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'}"
        >
          Home
        </a>

        <a 
        href="/about" 
        class="py-2 px-3 font-medium text-sm transition-colors duration-200 {activePath === '/about' ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'}"
      >
        About
      </a>
      
        
        {#each navbarItems as item}
          {#if item.name !== 'legal'}
            <a 
              href={item.url} 
              class="py-2 px-3 font-medium text-sm transition-colors duration-200 {activePath === item.url ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}
        
        <a href="/docs" class="ml-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] text-sm font-medium transition-colors duration-200">
          Documentation
        </a>
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
    <div class="md:hidden bg-transparent">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a 
          href="/" 
          class="block px-3 py-2 rounded-md text-base font-medium {activePath === '/' ? 'bg-surface text-white' : 'text-slate-300 hover:bg-surface hover:text-white'}"
        >
          Home
        </a>
        
        {#each navbarItems as item}
          {#if item.name !== 'legal'}
            <a 
              href={item.url} 
              class="block px-3 py-2 rounded-md text-base font-medium {activePath === item.url ? 'bg-surface text-white' : 'text-slate-300 hover:bg-surface hover:text-white'}"
            >
              {item.title}
            </a>
          {/if}
        {/each}
        
        <a href="/docs" class="block px-3 py-2 rounded-md text-base font-medium bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] mt-3">
          Documentation
        </a>
      </div>
    </div>
  {/if}
</nav>

