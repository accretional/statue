<script lang="ts">
  // BlogHeader component - Linear-style blog header
  import type { BlogHeaderProps } from './types';

  type Props = BlogHeaderProps;

  let {
    title = 'Blog',
  }: Props = $props();
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
