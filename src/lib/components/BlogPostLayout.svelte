<script>
  // BlogPostLayout component - Linear-style blog post layout wrapper
  import BlogPostHeader from './BlogPostHeader.svelte';
  import BlogPostContent from './BlogPostContent.svelte';

  export let title = '';
  export let description = '';
  export let date = '';
  export let author = '';
  export let authorAvatar = '';
  export let thumbnail = '';
  export let content = '';
  export let backLink = '/blog';
  export let backLinkText = 'Blog';
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
