<!--
  DocsLayout - Professional 3-column documentation layout wrapper

  Usage:
  ```svelte
  <script>
    import { DocsLayout } from 'statue-ssg';

    const sidebarItems = [...];
    const headings = [...];
  </script>

  <DocsLayout
    {sidebarItems}
    {headings}
    activePath="/docs/getting-started"
    sidebarTitle="Documentation"
  >
    <YourContentComponent />
  </DocsLayout>
  ```

  Props:
  - sidebarItems: Navigation items for the left sidebar
  - headings: Heading items for the right TOC
  - activePath: Current URL path for highlighting
  - sidebarTitle: Title for the sidebar (default: 'Documentation')
  - showSearch: Show search in sidebar (default: true)
  - showToc: Show table of contents (default: true)
-->

<script lang="ts">
  import DocsSidebar from './DocsSidebar.svelte';
  import TableOfContents from './TableOfContents.svelte';

  export interface DocsLayoutProps {
    sidebarItems?: Array<{
      title: string;
      url?: string;
      children?: Array<{
        title: string;
        url?: string;
        children?: Array<{
          title: string;
          url: string;
        }>;
      }>;
    }>;
    headings?: Array<{
      id: string;
      text: string;
      level: number;
    }>;
    activePath?: string;
    sidebarTitle?: string;
    showSearch?: boolean;
    showToc?: boolean;
  }

  let { sidebarItems = [], headings = [], activePath = '', sidebarTitle = 'Documentation', showSearch = true, showToc = true }: DocsLayoutProps = $props();

  let isMobileSidebarOpen = false;

  function toggleMobileSidebar() {
    isMobileSidebarOpen = !isMobileSidebarOpen;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen = false;
  }
</script>

<div class="docs-layout min-h-screen bg-[var(--color-background)]">
  <!-- Mobile sidebar toggle button -->
  <button
    class="fixed bottom-4 right-4 z-50 lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg"
    on:click={toggleMobileSidebar}
    aria-label="Toggle sidebar"
  >
    {#if isMobileSidebarOpen}
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    {:else}
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    {/if}
  </button>

  <!-- Mobile sidebar overlay -->
  {#if isMobileSidebarOpen}
    <div
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      on:click={closeMobileSidebar}
      on:keydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
      role="button"
      tabindex="-1"
    ></div>
  {/if}

  <div class="container mx-auto px-4 pt-16">
    <div class="flex">
      <!-- Left Sidebar - Desktop only -->
      <div class="hidden lg:block w-64 flex-shrink-0">
        <div class="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <DocsSidebar
            items={sidebarItems}
            {activePath}
            title={sidebarTitle}
            {showSearch}
          />
        </div>
      </div>

      <!-- Left Sidebar - Mobile (slide-in) -->
      <div
        class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-50 transform transition-transform duration-300 lg:hidden bg-[var(--color-background)]
          {isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
      >
        <DocsSidebar
          items={sidebarItems}
          {activePath}
          title={sidebarTitle}
          {showSearch}
        />
      </div>

      <!-- Main content area - full width on mobile -->
      <main class="flex-1 min-w-0 min-h-[calc(100vh-4rem)] relative">
        <!-- Border line starting below "On this page" title level -->
        <div class="hidden lg:block absolute left-0 top-12 bottom-0 w-px bg-[var(--color-border)]"></div>
        <div class="px-4 sm:px-6 lg:px-8 py-8">
          <slot />
        </div>
      </main>

      <!-- Right TOC - Desktop only -->
      {#if showToc}
        <div class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-16 pt-5 px-6">
            <TableOfContents {headings} />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .docs-layout {
    /* Ensure proper stacking context */
    position: relative;
  }
</style>
