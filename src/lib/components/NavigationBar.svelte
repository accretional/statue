<script>
  export let navbarItems = [];
  export let activePath = '';
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="bg-black text-white border-b border-gray-800 shadow-lg fixed w-full top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <!-- Logo icon - custom SVG similar to BotGauge -->
          <div class="text-green-500 w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="font-bold text-xl">
            <span class="text-green-500">Statue</span>SSG
          </span>
        </a>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <a 
          href="/" 
          class="py-2 px-3 font-medium text-sm transition-colors duration-200 {activePath === '/' ? 'text-green-400' : 'text-gray-300 hover:text-white'}"
        >
          Home
        </a>
        
        {#each navbarItems as item}
          <a 
            href={item.url} 
            class="py-2 px-3 font-medium text-sm transition-colors duration-200 {activePath === item.url ? 'text-green-400' : 'text-gray-300 hover:text-white'}"
          >
            {item.title}
          </a>
        {/each}
        
        <a href="/docs" class="ml-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors duration-200">
          Documentation
        </a>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button on:click={toggleMenu} class="text-gray-400 hover:text-white focus:outline-none">
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
    <div class="md:hidden bg-gray-900 border-t border-gray-800">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a 
          href="/" 
          class="block px-3 py-2 rounded-md text-base font-medium {activePath === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
        >
          Home
        </a>
        
        {#each navbarItems as item}
          <a 
            href={item.url} 
            class="block px-3 py-2 rounded-md text-base font-medium {activePath === item.url ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
          >
            {item.title}
          </a>
        {/each}
        
        <a href="/docs" class="block px-3 py-2 rounded-md text-base font-medium bg-green-500 hover:bg-green-600 text-white mt-3">
          Documentation
        </a>
      </div>
    </div>
  {/if}
</nav>

<!-- Spacer for fixed navbar -->
<div class="h-16"></div> 