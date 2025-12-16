<script>
  // BlogHeader component - Linear-style blog header
  export let title = 'Blog';
</script>

<header class="blog-header">
  <h1 class="title">{title}</h1>
</header>

<style>
  .blog-header {
    margin-bottom: 48px;
  }

  .title {
    font-size: 48px;
    font-weight: 500;
    color: var(--color-foreground);
    letter-spacing: -0.02em;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 36px;
    }
  }
</style>
