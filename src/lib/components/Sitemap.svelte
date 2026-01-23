<script lang="ts">
  export interface SitemapProps {
    directories?: Array<{
      name: string;
      path: string;
      title: string;
      url: string;
      subpages?: Array<{
        title: string;
        url: string;
      }>;
    }>;
    currentPath?: string;
  }

  interface Directory {
    name: string;
    path: string;
    title: string;
    url: string;
    subpages?: {
      title: string;
      url: string;
    }[];
  }

  let {
    directories = [],
    currentPath = ''
  }: SitemapProps = $props();
</script>
  
  <div class="sitemap mt-6 pt-4">
  
    
    <div class="sitemap-grid grid grid-cols-2 md:grid-cols-3 gap-4">
      <!-- Static pages first (left side) -->
      <div class="sitemap-category">
        <h4 class="text-lg font-medium mb-2">Main Pages</h4>
        <ul class="ml-2 space-y-1">
          <li>
            <a 
              href="/" 
              class="{currentPath === '/' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/pricing" 
              class="{currentPath === '/pricing' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
            >
              Pricing
            </a>
          </li>
          <li>
            <a 
              href="/privacy-policy" 
              class="{currentPath === '/privacy-policy' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a 
              href="/do-not-sell" 
              class="{currentPath === '/do-not-sell' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
            >
              Do Not Sell My Information
            </a>
          </li>
          <li>
            <a 
              href="/terms" 
              class="{currentPath === '/terms' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
            >
              Terms of Use
            </a>
          </li>
        </ul>
      </div>
      
      {#if directories && directories.length > 0}
        {#each directories as directory}
          <div class="sitemap-category">
            <h4 class="text-lg font-medium mb-2">
              <a 
                href={directory.url} 
                class="{currentPath.startsWith(directory.url) ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'} hover:text-amber-400"
              >
                {directory.title}
              </a>
            </h4>
            
            {#if directory.subpages && directory.subpages.length > 0}
              <ul class="ml-2 space-y-1">
                {#each directory.subpages as subpage}
                  <li>
                    <a 
                      href={subpage.url} 
                      class="{currentPath === subpage.url ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-amber-400 text-sm"
                    >
                      {subpage.title}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
  
  <style>
    .sitemap-grid {
      margin-bottom: 1rem;
    }
    
    .sitemap-category {
      margin-bottom: 1rem;
    }
  </style>
