<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  type AccordionType = 'single' | 'multiple';
  
  interface AccordionItem {
    value: string;
    trigger: string;
    content: string;
  }
  
  export let type: AccordionType = 'single';
  export let collapsible: boolean = false;
  export let items: AccordionItem[] = [];
  
  let className: string = '';
  export { className as class };
  
  let openItems: Set<string> = new Set();
  
  function toggleItem(value: string) {
    if (type === 'single') {
      if (openItems.has(value)) {
        if (collapsible) {
          openItems = new Set();
        }
      } else {
        openItems = new Set([value]);
      }
    } else {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(value)) {
        newOpenItems.delete(value);
      } else {
        newOpenItems.add(value);
      }
      openItems = newOpenItems;
    }
  }
  
  function isOpen(value: string): boolean {
    return openItems.has(value);
  }
</script>

<div class="accordion {className}" data-orientation="vertical">
  {#each items as item (item.value)}
    <div class="accordion-item border-b" data-state={isOpen(item.value) ? 'open' : 'closed'}>
      <h3 class="accordion-header flex">
        <button
          type="button"
          class="accordion-trigger flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
          aria-expanded={isOpen(item.value)}
          data-state={isOpen(item.value) ? 'open' : 'closed'}
          on:click={() => toggleItem(item.value)}
        >
          {item.trigger}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 shrink-0 transition-transform duration-200"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>
      {#if isOpen(item.value)}
        <div
          class="accordion-content overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          data-state="open"
          transition:slide={{ duration: 200, easing: quintOut }}
        >
          <div class="pb-4 pt-0">
            {item.content}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .accordion-item {
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .accordion-trigger {
    text-align: left;
  }
  
  .accordion-trigger:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
</style>
