<script lang="ts">
  import type { BlogPostLayoutProps } from './types';
  import BlogPostHeader from './BlogPostHeader.svelte';
  import BlogPostContent from './BlogPostContent.svelte';

  let { title = '', description = '', date = '', author = '', authorAvatar = '', thumbnail = '', content = '', backLink = '/blog', backLinkText = 'Blog' }: BlogPostLayoutProps = $props();
</script>

<div class="blog-post-layout">
  <div class="blog-post-container">
    <BlogPostHeader
      {title}
      {description}
      {date}
      {author}
      {authorAvatar}
      {thumbnail}
      {backLink}
      {backLinkText}
    />

    <BlogPostContent {content} />
  </div>
</div>

<style>
  .blog-post-layout {
    min-height: 100vh;
    background: var(--color-background);
  }

  .blog-post-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 48px 120px;
  }

  @media (max-width: 768px) {
    .blog-post-container {
      padding: 80px 24px 80px;
    }
  }
</style>
