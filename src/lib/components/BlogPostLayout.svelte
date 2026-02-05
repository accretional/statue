<script lang="ts">
  // BlogPostLayout component - Full blog post page layout
  import BlogPostHeader from './BlogPostHeader.svelte';
  import BlogPostContent from './BlogPostContent.svelte';

  export interface BlogPostLayoutProps {
    title?: string;
    description?: string;
    date?: string;
    author?: string;
    authorAvatar?: string;
    thumbnail?: string;
    content?: string;
    backLink?: string;
    backLinkText?: string;
    tags?: string[];
    enableTags?: boolean;
  }

  let { title = '', description = '', date = '', author = '', authorAvatar = '', thumbnail = '', content = '', backLink = '/blog', backLinkText = 'Blog', tags = [], enableTags = false }: BlogPostLayoutProps = $props();
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
      {tags}
      {enableTags}
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
