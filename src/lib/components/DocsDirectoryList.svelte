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
    primaryButtonText="Get Started"
    primaryButtonUrl="/docs/get-started"
    secondaryButtonText="Components"
    secondaryButtonUrl="/docs/components"
  />
  ```

  Props:
  - title: Directory title
  - description: Optional directory description
  - content: Array of content items in this directory (each item can have metadata.icon)
  - subDirectories: Array of subdirectories
  - primaryButtonText: Text for primary CTA button (defaults to first sorted item title)
  - primaryButtonUrl: URL for primary CTA button (defaults to first sorted item URL)
  - secondaryButtonText: Text for secondary CTA button (defaults to second sorted item title)
  - secondaryButtonUrl: URL for secondary CTA button (defaults to second sorted item URL)

  Available icons (set via frontmatter icon field):
  - bolt: Lightning bolt (quick start, getting started)
  - components: Layout/components icon
  - checklist: Checklist icon
  - map: Route/sitemap icon
  - settings: Settings/config icon
  - palette: Theme/styling icon
  - document: Default document icon
-->

<script lang="ts">
  export interface DocsDirectoryListProps {
    title?: string;
    description?: string;
    content?: Array<{
      url: string;
      metadata?: {
        title?: string;
        description?: string;
        icon?: string;
        order?: number;
      };
      title?: string;
      slug?: string;
    }>;
    subDirectories?: Array<{
      name: string;
      url: string;
      description?: string;
    }>;
    primaryButtonText?: string;
    primaryButtonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
  }

  let { title = '', description = 'Guides, resources, and references to help you build with Statue.', content = [], subDirectories = [], primaryButtonText = '', primaryButtonUrl = '', secondaryButtonText = '', secondaryButtonUrl = '' }: DocsDirectoryListProps = $props();

  // Icon SVG paths map - users can set icon in markdown frontmatter
  const iconPaths = {
    bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
    components: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    checklist: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    palette: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    document: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  };

  // Settings icon has an extra circle path
  const settingsCircle = 'M15 12a3 3 0 11-6 0 3 3 0 016 0z';

  // Get icon path from metadata, fallback to document
  function getIconPath(item) {
    const iconName = item?.metadata?.icon;
    return (iconName && iconPaths[iconName]) ? iconPaths[iconName] : iconPaths.document;
  }

  function isSettingsIcon(item) {
    return item?.metadata?.icon === 'settings';
  }

  // Sort content by order (items with order come first, then by order value)
  let sortedContent = $derived([...content].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999;
    const orderB = b.metadata?.order ?? 999;
    return orderA - orderB;
  }));

  // Featured content is first 2 items after sorting
  let featuredContent = $derived(sortedContent.slice(0, 2));

  // Resolved button values (props override defaults from content)
  let resolvedPrimaryText = $derived(primaryButtonText || featuredContent[0]?.metadata?.title || 'Get Started');
  let resolvedPrimaryUrl = $derived(primaryButtonUrl || featuredContent[0]?.url || '/docs');
  let resolvedSecondaryText = $derived(secondaryButtonText || featuredContent[1]?.metadata?.title || '');
  let resolvedSecondaryUrl = $derived(secondaryButtonUrl || featuredContent[1]?.url || '');
</script>

<article class="docs-directory relative">
  <!-- Background glow effect - positioned at right -->
  <div class="absolute top-32 -right-20 w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.08] blur-[150px] rounded-full pointer-events-none"></div>

  <!-- Hero Section -->
  <header class="text-center mb-12 pt-8 relative z-10">
    <h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-foreground)] mb-4">
      {title}
    </h1>
    <p class="text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto mb-8">
      {description}
    </p>

    <!-- CTA Buttons -->
    {#if resolvedPrimaryUrl}
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a
          href={resolvedPrimaryUrl}
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:brightness-110 transition-all"
        >
          {resolvedPrimaryText}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        {#if resolvedSecondaryUrl}
          <a
            href={resolvedSecondaryUrl}
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
          >
            {resolvedSecondaryText}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/if}
      </div>
    {/if}
  </header>

  <!-- Feature Cards Grid -->
  {#if sortedContent && sortedContent.length > 0}
    <section class="mb-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each sortedContent as item}
          <a
            href={item.url}
            class="group relative p-6 rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-card)]/50 to-transparent hover:border-[var(--color-primary)]/50 hover:from-[var(--color-card)] transition-all"
          >
            <!-- Icon - driven by metadata.icon, fallback to document -->
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(item)} />
                  {#if isSettingsIcon(item)}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={settingsCircle} />
                  {/if}
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
                  {item.metadata?.title || item.title || item.slug}
                </h3>
                {#if item.metadata?.description}
                  <p class="text-sm text-[var(--color-muted)] line-clamp-2">
                    {item.metadata.description}
                  </p>
                {/if}
              </div>

              <svg class="flex-shrink-0 w-5 h-5 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
