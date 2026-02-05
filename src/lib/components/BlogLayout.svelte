<script lang="ts">
  // BlogLayout component - Linear-style blog layout wrapper
  import BlogHeader from './BlogHeader.svelte';
  import BlogGrid from './BlogGrid.svelte';

  export interface BlogLayoutProps {
    title?: string;
    posts?: Array<any>;
    enableTags?: boolean;
  }

  let {
    title = 'Blog',
    posts = [],
    enableTags = false
  }: BlogLayoutProps = $props();
</script>

<div class="blog-layout">
  <div class="blog-container">
    <BlogHeader {title} />
    <BlogGrid {posts} {enableTags} />
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
