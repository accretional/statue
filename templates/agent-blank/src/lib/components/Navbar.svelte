<script>
  // AI AGENT: NAVIGATION BAR COMPONENT
  // Customize logo, colors, and add more links as needed

  export let directories = [];
  export let activePath = '/';
</script>

<nav class="navbar-box">
  <a href="/" class="text-xl font-bold text-primary no-underline hover:text-white">
    <span class="text-muted font-normal">Statue/</span>Scaffold
  </a>
  <div class="flex gap-6">
    {#each directories as dir}
      <a
        href={dir.url}
        class="text-secondary no-underline font-medium transition-colors hover:text-primary"
        class:text-primary={activePath === dir.url || activePath.startsWith(dir.url + '/')}
      >
        {dir.title}
      </a>
    {/each}
  </div>
</nav>