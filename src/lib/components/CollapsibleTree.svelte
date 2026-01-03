<!--
  CollapsibleTree - Recursive collapsible tree component for nested data structures
  
  Usage:
  ```svelte
  <script>
    import { CollapsibleTree } from 'statue-ssg';
    
    const items = [
      {
        id: 'item-1',
        label: 'Parent Item',
        badge: 'completed',  // optional: completed, running, pending, error
        children: [
          {
            id: 'item-1-1',
            label: 'Child Item',
            badge: 'running',
            children: [
              { id: 'item-1-1-1', label: 'Nested Child', badge: 'pending' }
            ]
          }
        ]
      },
      { id: 'item-2', label: 'Another Item', badge: 'error' }
    ];
  </script>
  
  <CollapsibleTree {items} title="My Tree" />
  ```
  
  Props:
  - items: Array of objects with { id, label, badge?, children? }
  - title: String for the tree title (default: 'Collapsible Tree')
  
  All items are expanded by default. Click chevron to collapse/expand.
-->

<script>
  export let items = [];
  export let title = 'Collapsible Tree';
  
  let expanded = {};
  
  // Initialize all as expanded when items change
  $: if (items.length > 0 && Object.keys(expanded).length === 0) {
    items.forEach(item => initExpanded(item));
    expanded = expanded; // trigger reactivity
  }
  
  // Flatten all items with their levels - reactive to expanded changes
  $: flatItems = flattenItems(items, expanded);
  
  function initExpanded(item) {
    expanded[item.id] = true;
    if (item.children) {
      item.children.forEach(child => initExpanded(child));
    }
  }
  
  function flattenItems(itemList, expandedState, level = 0, result = []) {
    itemList.forEach(item => {
      result.push({ ...item, level });
      if (item.children && item.children.length > 0 && expandedState[item.id]) {
        flattenItems(item.children, expandedState, level + 1, result);
      }
    });
    return result;
  }
  
  function toggle(itemId) {
    expanded[itemId] = !expanded[itemId];
  }
  
  function hasChildren(item) {
    return item.children && item.children.length > 0;
  }
  
  function getBadgeClass(badge) {
    const classes = {
      completed: 'bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]',
      running: 'bg-[color:var(--color-primary)]/15 text-[color:var(--color-foreground)]',
      pending: 'bg-[color:var(--color-muted)]/20 text-[color:var(--color-muted)]',
      error: 'bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]'
    };
    return classes[badge] || classes.pending;
  }
</script>

<div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 backdrop-blur-sm p-6">
  <h3 class="text-xl font-semibold mb-4 text-[color:var(--color-foreground)]">{title}</h3>
  
  <div class="space-y-0.5">
    {#each flatItems as item}
      <button
        class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left hover:bg-[color:var(--color-card)]/80 transition-colors"
        style="padding-left: {item.level * 1.5 + 0.75}rem"
        on:click={() => hasChildren(item) && toggle(item.id)}
      >
        <!-- Chevron -->
        {#if hasChildren(item)}
          <svg 
            class="w-4 h-4 text-[color:var(--color-muted)] transition-transform flex-shrink-0"
            class:rotate-90={expanded[item.id]}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        {:else}
          <span class="w-4 flex-shrink-0"></span>
        {/if}

        <!-- Icon -->
        <span class="flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--color-primary)]/10 flex-shrink-0">
          <svg class="w-3.5 h-3.5 text-[color:var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>

        <!-- Label -->
        <span class="font-medium text-[color:var(--color-foreground)] flex-1">
          {item.label || item.name}
        </span>

        <!-- Badge -->
        {#if item.badge}
          <span class="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 {getBadgeClass(item.badge)}">
            {item.badge}
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>

