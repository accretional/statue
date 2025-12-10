<!--
  DocsDirectoryList - Documentation directory listing component

  Usage:
  ```svelte
  <script>
    import { DocsDirectoryList } from 'statue-ssg';
  </script>

  <DocsDirectoryList
    title="Documentation"
    description="Browse our documentation"
    content={contentArray}
    subDirectories={subDirectoriesArray}
  />
  ```

  Props:
  - title: Directory title
  - description: Optional directory description
  - content: Array of content items in this directory
  - subDirectories: Array of subdirectories
-->

<script>
  export let title = '';
  export let description = '';
  export let content = [];
  export let subDirectories = [];
</script>

<article class="docs-directory">
  <!-- Page header -->
  <header class="mb-8 pb-8 border-b border-[var(--color-border)]">
    <h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4">
      {title}
    </h1>
    {#if description}
      <p class="text-lg text-[var(--color-muted)] leading-relaxed">
        {description}
      </p>
    {/if}
  </header>

  <!-- Subdirectories -->
  {#if subDirectories && subDirectories.length > 0}
    <section class="mb-10">
      <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-4">Categories</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each subDirectories as subDir}
          <a
            href={subDir.url}
            class="group p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]/50 hover:border-[var(--color-primary)] hover:bg-[var(--color-card)] transition-all"
          >
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                  {subDir.title}
                </h3>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Content list -->
  {#if content && content.length > 0}
    <section>
      <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-4">
        {subDirectories && subDirectories.length > 0 ? 'All Articles' : 'Articles'}
      </h2>
      <div class="space-y-3">
        {#each content as item}
          <a
            href={item.url}
            class="group block p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]/30 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-card)]/70 transition-all"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
                  {item.metadata?.title || item.title || item.slug}
                </h3>
                {#if item.metadata?.description}
                  <p class="text-sm text-[var(--color-muted)] line-clamp-2">
                    {item.metadata.description}
                  </p>
                {/if}
                {#if item.metadata?.date || item.directory}
                  <div class="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted)]">
                    {#if item.metadata?.date}
                      <span>{item.metadata.date}</span>
                    {/if}
                    {#if item.directory && item.directory !== title.toLowerCase()}
                      <span class="px-2 py-0.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)]">
                        {item.directory}
                      </span>
                    {/if}
                  </div>
                {/if}
              </div>
              <svg class="flex-shrink-0 w-5 h-5 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Empty state -->
  {#if (!content || content.length === 0) && (!subDirectories || subDirectories.length === 0)}
    <div class="text-center py-12">
      <svg class="mx-auto w-12 h-12 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-4 text-[var(--color-muted)]">No content found in this directory.</p>
    </div>
  {/if}
</article>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
