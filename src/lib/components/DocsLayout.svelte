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

<script>
  import DocsSidebar from './DocsSidebar.svelte';
  import TableOfContents from './TableOfContents.svelte';
  import NavigationBar from './NavigationBar.svelte';

  export let sidebarItems = [];
  export let headings = [];
  export let activePath = '';
  export let sidebarTitle = 'Documentation';
  export let showSearch = true;
  export let showToc = true;
  export let navbarItems = [];

  let isMobileSidebarOpen = false;

  function toggleMobileSidebar() {
    isMobileSidebarOpen = !isMobileSidebarOpen;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen = false;
  }
</script>

<div class="docs-layout min-h-screen bg-[var(--color-background)]">
  <!-- Use existing NavigationBar -->
  <NavigationBar {navbarItems} {activePath} />

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
      <!-- Left Sidebar - Desktop -->
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

      <!-- Left Sidebar - Mobile -->
      <div
        class="fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 transform transition-transform duration-300 lg:hidden
          {isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
      >
        <DocsSidebar
          items={sidebarItems}
          {activePath}
          title={sidebarTitle}
          {showSearch}
        />
      </div>

      <!-- Main content area -->
      <main class="flex-1 min-h-[calc(100vh-4rem)] lg:border-l lg:border-[var(--color-border)]">
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
