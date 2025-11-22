<script lang="ts">
	const currentYear = new Date().getFullYear();

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

	export let directories: Directory[] = [];
	export let currentPath: string = '';
  
  export let mainPagesTitle = 'Main Pages';
  export let homePageText = 'Home Page';
  
  export let copyrightText = `© ${currentYear} Statue SSG. Static site generator developed with SvelteKit.`;
  
  export let legalLinks = [
    { title: 'Privacy Policy', url: '/legal/privacy-policy' },
    { title: 'Do Not Sell My Information', url: '/legal/do-not-sell' },
    { title: 'Terms of Use', url: '/legal/terms' }
  ];

  export let socialLinks = [
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com', 
      iconPath: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' 
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com',
      iconPath: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      iconPath: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    }
  ];
</script>

<footer class="bg-[var(--color-card)] text-[var(--color-muted)] py-10 border-t border-[var(--color-border)]">
  <div class="container mx-auto px-4">
    <div class="sitemap mt-6 pt-4 mb-8">
      <div class="sitemap-grid grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="sitemap-category">
          <h4 class="text-lg font-medium mb-2 text-[var(--color-foreground)]">{mainPagesTitle}</h4>
          <ul class="ml-2 space-y-1">
            <li>
              <a 
                href="/" 
                class="{currentPath === '/' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-[var(--color-primary)] text-sm"
              >
                {homePageText}
              </a>
            </li>
            {#if directories && directories.length > 0}
              {#each directories as directory}
                {#if directory.name !== 'legal'}
                  <li>
                    <a 
                      href={directory.url}
                      class="{currentPath === directory.url ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-[var(--color-primary)] text-sm"
                    >
                      {directory.title}
                    </a>
                  </li>
                {/if}
              {/each}
            {/if}
          </ul>
        </div>
        
        {#if directories && directories.length > 0}
          {#each directories as directory}
            {#if directory.name !== 'legal'}
              <div class="sitemap-category">
                <h4 class="text-lg font-medium mb-2 text-[var(--color-foreground)]">
                  <a 
                    href={directory.url} 
                    class="{currentPath.startsWith(directory.url) ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'} hover:text-[var(--color-primary)]"
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
                          class="{currentPath === subpage.url ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'} hover:text-[var(--color-primary)] text-sm"
                        >
                          {subpage.title}
                        </a>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    </div>

    <div class="text-center">
      <p>{copyrightText}</p>
      <div class="mt-4 flex justify-center space-x-6">
        {#each legalLinks as link}
          <a href={link.url} class="text-[var(--color-muted)] hover:text-[var(--color-primary)]">{link.title}</a>
        {/each}
      </div>
      
      <div class="mt-6 flex justify-center space-x-8">
        {#each socialLinks as social}
          <a href={social.url} target="_blank" rel="noopener noreferrer" class="text-[var(--color-muted)] hover:text-[var(--color-primary)]" aria-label={social.name}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d={social.iconPath}/>
            </svg>
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>

<style>
  .sitemap-grid {
    margin-bottom: 1rem;
  }
  
  .sitemap-category {
    margin-bottom: 1rem;
  }
</style> 