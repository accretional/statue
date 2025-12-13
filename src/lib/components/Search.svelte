<!--
  Search Component - Client-side search with dropdown results

  Usage:
  ```svelte
  <script>
    import { Search } from 'statue-ssg';
  </script>

  <Search />
  ```

  Props:
  - placeholder: Input placeholder text (default: 'Search...')
  - debounceMs: Search delay in milliseconds (default: 300)
  - minQueryLength: Minimum query length to trigger search (default: 2)
  - maxResults: Maximum number of results to show (default: 10)
  - showCategories: Show category badges (default: true)
  - showDates: Show dates in results (default: true)
  - showExcerpts: Show excerpts in results (default: true)
  - containerClass: Additional classes for container
  - inputClass: Additional classes for input
  - resultsClass: Additional classes for results dropdown
-->

<script>
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  // Props
  export let placeholder = 'Search...';
  export let debounceMs = 300;
  export let minQueryLength = 2;
  export let maxResults = 10;
  export let showCategories = true;
  export let showDates = true;
  export let showExcerpts = true;
  export let containerClass = '';
  export let inputClass = '';
  export let resultsClass = '';

  // State
  let query = '';
  let results = [];
  let isOpen = false;
  let isLoading = false;
  let pagefind = null;
  let selectedIndex = -1;
  let searchTimeout;
  let containerRef;
  let inputRef;

  // Debounced search function
  async function handleInput() {
    clearTimeout(searchTimeout);

    if (query.length < minQueryLength) {
      results = [];
      isOpen = false;
      return;
    }

    searchTimeout = setTimeout(async () => {
      await performSearch();
    }, debounceMs);
  }

  // Load Pagefind lazily
  async function loadPagefind() {
    if (pagefind) return pagefind;
    if (!browser) return null;

    try {
      const pagefindPath = "/pagefind/pagefind.js";
      // @ts-ignore - Pagefind is generated at build time
      pagefind = await import(/* @vite-ignore */ pagefindPath);
      await pagefind.init();
      return pagefind;
    } catch (error) {
      console.error('Failed to load Pagefind:', error);
      return null;
    }
  }

  // Perform search
  async function performSearch() {
    if (!query || query.length < minQueryLength) {
      results = [];
      isOpen = false;
      return;
    }

    isLoading = true;
    const pf = await loadPagefind();

    if (pf) {
      try {
        const searchResults = await pf.search(query);
        const resultData = await Promise.all(
          searchResults.results.slice(0, maxResults).map(r => r.data())
        );

        results = resultData;
        isOpen = true;
      } catch (error) {
        console.error('Search error:', error);
        results = [];
      }
    }

    isLoading = false;
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        scrollToSelected();
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        scrollToSelected();
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        closeSearch();
        break;
    }
  }

  // Scroll to selected result
  function scrollToSelected() {
    if (selectedIndex < 0) return;

    const resultElement = document.getElementById(`search-result-${selectedIndex}`);
    if (resultElement) {
      resultElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // Navigate to selected result
  function navigateToResult(result) {
    if (result && result.url) {
      window.location.href = result.url;
    }
  }

  // Clear search
  function clearSearch() {
    query = '';
    results = [];
    isOpen = false;
    selectedIndex = -1;
    if (inputRef) inputRef.focus();
  }

  // Close search
  function closeSearch() {
    isOpen = false;
    selectedIndex = -1;
  }

  // Click outside handler
  function handleClickOutside(event) {
    if (containerRef && !containerRef.contains(event.target)) {
      closeSearch();
    }
  }

  // Extract category from URL
  function getCategory(url) {
    if (!url) return 'page';
    const parts = url.split('/').filter(Boolean);
    return parts[0] || 'page';
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  }

  // Truncate text to word boundary
  function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.slice(0, lastSpace) + '...';
  }

  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('click', handleClickOutside);
    }
    clearTimeout(searchTimeout);
  });
</script>

<!-- Search Container -->
<div
  class="search-container relative {containerClass}"
  bind:this={containerRef}
  role="search"
  aria-label="Site search"
>
  <!-- Search Input -->
  <div class="relative">
    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <input
      bind:this={inputRef}
      type="text"
      bind:value={query}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:focus={() => query.length >= minQueryLength && results.length > 0 && (isOpen = true)}
      {placeholder}
      class="search-input w-full pl-10 pr-10 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all {inputClass}"
      aria-label="Search input"
      aria-autocomplete="list"
      aria-controls="search-results"
      aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
    />

    <!-- Clear button -->
    {#if query}
      <button
        on:click={clearSearch}
        class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        aria-label="Clear search"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    {/if}

    <!-- Loading spinner -->
    {#if isLoading}
      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg
          class="animate-spin h-4 w-4 text-[var(--color-primary)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    {/if}
  </div>

  <!-- Results Dropdown -->
  {#if isOpen && results.length > 0}
    <div
      id="search-results"
      class="search-results absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto rounded-lg border border-[var(--color-border)] backdrop-blur-md bg-[var(--color-card)] shadow-lg z-[60] {resultsClass}"
      role="listbox"
      aria-label="Search results"
    >
      <div class="p-2 text-xs text-[var(--color-muted)] border-b border-[var(--color-border)]">
        {results.length} {results.length === 1 ? 'result' : 'results'} found
      </div>

      {#each results as result, index}
        <a
          id="search-result-{index}"
          href={result.url}
          class="search-result block p-3 hover:bg-[var(--color-background)]/50 border-b border-[var(--color-border)]/30 last:border-b-0 transition-colors {selectedIndex === index ? 'bg-[var(--color-background)]/50' : ''}"
          role="option"
          aria-selected={selectedIndex === index}
          on:mouseenter={() => selectedIndex = index}
        >
          <!-- Title -->
          <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="text-sm font-medium text-[var(--color-foreground)] line-clamp-1">
              {@html result.meta?.title || result.title || 'Untitled'}
            </h3>

            <!-- Category badge -->
            {#if showCategories}
              <span class="flex-shrink-0 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                {getCategory(result.url)}
              </span>
            {/if}
          </div>

          <!-- Excerpt -->
          {#if showExcerpts && result.excerpt}
            <p class="text-xs text-[var(--color-muted)] line-clamp-2 mb-1">
              {@html truncateText(result.excerpt)}
            </p>
          {/if}

          <!-- Meta info -->
          <div class="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span>{result.url}</span>
            {#if showDates && result.meta?.date}
              <span>•</span>
              <span>{formatDate(result.meta.date)}</span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}

  <!-- Empty state -->
  {#if isOpen && !isLoading && query.length >= minQueryLength && results.length === 0}
    <div
      class="search-empty absolute top-full left-0 right-0 mt-2 p-6 rounded-lg border border-[var(--color-border)] backdrop-blur-md bg-[var(--color-card)] shadow-lg z-[60] text-center"
      role="status"
    >
      <svg
        class="w-12 h-12 mx-auto mb-3 text-[var(--color-muted)]/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p class="text-sm text-[var(--color-muted)]">
        No results found for "{query}"
      </p>
    </div>
  {/if}
</div>

<style>
  .search-input::placeholder {
    color: var(--color-muted);
  }

  .search-results {
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .search-result:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }

  /* Scrollbar styling */
  .search-results::-webkit-scrollbar {
    width: 6px;
  }

  .search-results::-webkit-scrollbar-track {
    background: transparent;
  }

  .search-results::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }

  .search-results::-webkit-scrollbar-thumb:hover {
    background: var(--color-muted);
  }
</style>
