<script>
  // AuthorAvatar component - Shows author profile image or initials
  export let author = '';
  export let avatar = '';
  export let size = 24; // Default size in pixels

  // Get initial from author name (first letter only)
  $: initial = getInitial(author);

  function getInitial(name) {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  }
</script>

<div
  class="author-avatar"
  style="width: {size}px; height: {size}px; font-size: {size * 0.45}px;"
>
  {#if avatar}
    <img src={avatar} alt={author} class="avatar-image" />
  {:else}
    <div class="avatar-initials">
      {initial}
    </div>
  {/if}
</div>

<style>
  .author-avatar {
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-secondary);
    color: white;
    font-weight: 500;
    letter-spacing: -0.02em;
    box-sizing: border-box;
    border: 1px solid var(--color-border);
    border-radius: 50%;
  }
</style>
