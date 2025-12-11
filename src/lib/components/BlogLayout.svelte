<script>
  // BlogLayout component - Linear-style blog layout wrapper
  import NavigationBar from './NavigationBar.svelte';
  import BlogHeader from './BlogHeader.svelte';
  import BlogGrid from './BlogGrid.svelte';

  export let title = 'Blog';
  export let posts = [];
  export let navbarItems = [];
  export let activePath = '/blog';
</script>

<NavigationBar {navbarItems} {activePath} />

<div class="blog-layout">
  <div class="blog-container">
    <BlogHeader {title} />
    <BlogGrid {posts} />
  </div>
</div>

<style>
  .blog-layout {
    min-height: 100vh;
    background: var(--color-background);
  }

  .blog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 48px;
  }

  @media (max-width: 768px) {
    .blog-container {
      padding: 48px 24px;
    }
  }
</style>
