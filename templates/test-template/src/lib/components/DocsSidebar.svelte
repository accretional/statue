<!--
  DocsSidebar - Professional documentation sidebar with hierarchical navigation

  Usage:
  ```svelte
  <script>
    import { DocsSidebar } from 'statue-ssg';

    const items = [
      {
        title: 'Getting Started',
        url: '/docs/getting-started',
        children: [
          { title: 'Installation', url: '/docs/installation' },
          { title: 'Quick Start', url: '/docs/quick-start' }
        ]
      },
      {
        title: 'Guides',
        children: [
          { title: 'Configuration', url: '/docs/configuration' },
          { title: 'Deployment', url: '/docs/deployment' }
        ]
      }
    ];
  </script>

  <DocsSidebar {items} activePath="/docs/installation" />
  ```

  Props:
  - items: Array of navigation items with { title, url?, children? }
  - activePath: Current active URL path for highlighting
  - title: Optional sidebar title (default: 'Documentation')
  - showSearch: Show search input (default: true)
-->

<script>
  export let items = [];
  export let activePath = '';
  export let title = 'Documentation';
  export let showSearch = true;

  let searchQuery = '';
  let expandedSections = {};

  // Initialize expanded state based on active path
  $: {
    if (activePath && items.length > 0) {
      items.forEach((item, index) => {
        if (item.children) {
          const hasActiveChild = item.children.some(child =>
            child.url === activePath ||
            (child.children && child.children.some(c => c.url === activePath))
          );
          if (hasActiveChild || item.url === activePath) {
            expandedSections[index] = true;
          }
        }
      });
      expandedSections = expandedSections;
    }
  }

  // Filter items based on search
  $: filteredItems = searchQuery
    ? filterItems(items, searchQuery.toLowerCase())
    : items;

  function filterItems(itemList, query) {
    return itemList.reduce((acc, item) => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const filteredChildren = item.children
        ? filterItems(item.children, query)
        : [];

      if (matchesTitle || filteredChildren.length > 0) {
        acc.push({
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item.children
        });
      }
      return acc;
    }, []);
  }

  function toggleSection(index) {
    expandedSections[index] = !expandedSections[index];
  }

  function isActive(url) {
    if (!url || !activePath) return false;
    // Normalize URLs by removing trailing slashes for comparison
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const normalizedActivePath = activePath.endsWith('/') ? activePath.slice(0, -1) : activePath;
    return normalizedActivePath === normalizedUrl;
  }

  function hasActiveChild(item) {
    if (!item.children) return false;
    return item.children.some(child =>
      isActive(child.url) || hasActiveChild(child)
    );
  }
</script>

<aside class="docs-sidebar w-64 flex-shrink-0 h-full overflow-y-auto bg-[var(--color-background)]">

  <!-- Navigation -->
  <nav class="pt-5 pb-4 pr-4">
    <ul class="space-y-1">
      {#each filteredItems as item, index}
        <li>
          {#if item.children && item.children.length > 0}
            <!-- Section with children -->
            <button
              class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                {hasActiveChild(item) ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}
                hover:bg-[var(--color-card)]"
              on:click={() => toggleSection(index)}
            >
              <span>{item.title}</span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                class:rotate-90={expandedSections[index]}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {#if expandedSections[index]}
              <ul class="mt-1 ml-3 pl-3 border-l border-[var(--color-border)] space-y-1">
                {#each item.children as child}
                  <li>
                    {#if child.children && child.children.length > 0}
                      <!-- Nested section -->
                      <div class="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider px-3 py-2 mt-2">
                        {child.title}
                      </div>
                      <ul class="space-y-1">
                        {#each child.children as grandchild}
                          <li>
                            <a
                              href={grandchild.url}
                              class="block px-3 py-1.5 text-sm rounded-lg transition-colors
                                {isActive(grandchild.url)
                                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)]'}"
                            >
                              {grandchild.title}
                            </a>
                          </li>
                        {/each}
                      </ul>
                    {:else}
                      <a
                        href={child.url}
                        class="block px-3 py-1.5 text-sm rounded-lg transition-colors
                          {isActive(child.url)
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)]'}"
                      >
                        {child.title}
                      </a>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          {:else if item.url}
            <!-- Direct link -->
            <a
              href={item.url}
              class="block px-3 py-2 text-sm font-medium rounded-lg transition-colors
                {isActive(item.url)
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-card)]'}"
            >
              {item.title}
            </a>
          {:else}
            <!-- Section header without link -->
            <div class="px-3 py-2 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
              {item.title}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  .docs-sidebar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  .docs-sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .docs-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .docs-sidebar::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 3px;
  }
</style>
