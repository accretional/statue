<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  type AccordionType = 'single' | 'multiple';
  
  interface AccordionItem {
    value: string;
    trigger: string;
    content: string;
  }
  
  interface Props {
    type?: AccordionType;
    collapsible?: boolean;
    items: AccordionItem[];
    class?: string;
  }

  let {
    type = 'single',
    collapsible = false,
    items = [],
    class: className = ''
  }: Props = $props();

  let openItems = $state(new Set<string>());
  
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
    <div class="accordion-item" data-state={isOpen(item.value) ? 'open' : 'closed'}>
      <h3 class="accordion-header">
        <button
          type="button"
          class="accordion-trigger"
          aria-expanded={isOpen(item.value)}
          data-state={isOpen(item.value) ? 'open' : 'closed'}
          onclick={() => toggleItem(item.value)}
        >
          <span class="trigger-text">{item.trigger}</span>
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
            class="chevron-icon"
            class:rotated={isOpen(item.value)}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>
      {#if isOpen(item.value)}
        <div
          class="accordion-content"
          data-state="open"
          transition:slide={{ duration: 200, easing: quintOut }}
        >
          <div class="content-inner">
            {item.content}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .accordion {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .accordion-item {
    border-bottom: 1px solid #334155;
  }

  .accordion-item:last-child {
    border-bottom: none;
  }

  .accordion-header {
    display: flex;
    margin: 0;
  }

  .accordion-trigger {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: left;
    background: transparent;
    border: none;
    color: #f1f5f9;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0.25rem;
  }

  .accordion-trigger:hover {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.1);
  }

  .accordion-trigger:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .trigger-text {
    flex: 1;
    pointer-events: none;
  }

  .chevron-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    margin-left: 0.5rem;
    pointer-events: none;
  }

  .chevron-icon.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    overflow: hidden;
    font-size: 0.875rem;
    color: #cbd5e1;
  }

  .content-inner {
    padding: 0 1rem 1rem 1rem;
    line-height: 1.6;
  }
</style>
