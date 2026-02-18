<script lang="ts">
  export interface TagListProps {
    tags?: string[];
  }

  let {
    tags = [],
  }: TagListProps = $props();
</script>

{#if tags && tags.length > 0}
  <div class="tag-list">
    {#each tags as tag}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <a
        href="/tags/{tag.toLowerCase().replace(/\s+/g, '-')}"
        class="tag"
        onclick={(e) => e.stopPropagation()}
      >
        {tag}
      </a>
    {/each}
  </div>
{/if}

<style>
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.4rem, 2vw, 0.75rem);
    margin-top: clamp(0.75rem, 3vw, 1rem);
  }

  .tag {
    display: inline-block;
    padding: clamp(0.375rem, 1.5vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem);
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    font-weight: 500;
    border-radius: 9999px;
    background-color: color-mix(in srgb, var(--color-muted) 20%, transparent);
    color: var(--color-primary);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .tag:hover {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  @media (max-width: 640px) {
    .tag-list {
      gap: clamp(0.375rem, 1.5vw, 0.625rem);
      margin-top: clamp(0.625rem, 2vw, 0.875rem);
    }

    .tag {
      padding: clamp(0.3rem, 1.2vw, 0.625rem) clamp(0.625rem, 2vw, 0.875rem);
      font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    }
  }
</style>