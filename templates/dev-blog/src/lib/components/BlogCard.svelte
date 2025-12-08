<script>
  let { post } = $props();

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<article class="group bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden hover:border-[var(--accent-primary)] hover:shadow-lg transition-all duration-300">
  <a href="/blog/{post.slug}" class="block p-6">
    <div class="flex items-center gap-2 mb-3">
      <span class="font-mono text-xs text-[var(--text-secondary)]">
        {formatDate(post.date)}
      </span>
      <span class="w-1 h-1 bg-[var(--accent-primary)] rounded-full"></span>
      <span class="font-mono text-xs text-[var(--accent-primary)]">
        ~3 dk okuma
      </span>
    </div>

    <h3 class="text-lg font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
      {post.title}
    </h3>

    <p class="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
      {post.excerpt}
    </p>

    <div class="flex flex-wrap gap-2">
      {#each post.tags as tag}
        <span class="px-2 py-1 bg-[var(--bg-primary)] rounded-md font-mono text-xs text-[var(--text-secondary)] border border-[var(--border-color)]">
          #{tag}
        </span>
      {/each}
    </div>

    <div class="mt-4 font-mono text-sm text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
      {">"} devam et →
    </div>
  </a>
</article>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>