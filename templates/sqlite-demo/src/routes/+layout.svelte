<script>
  import '$lib/index.css';
</script>

<div class="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
  <nav class="border-b border-[var(--color-border)] bg-[var(--color-card)]">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-[var(--color-primary)]">Statue SQLite Demo</h1>
          <p class="text-sm text-[var(--color-muted)]">Multi-database dynamic component rendering</p>
        </div>
        <a
          href="https://github.com/accretional/statue"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  </nav>

  <main>
    <slot />
  </main>

  <footer class="border-t border-[var(--color-border)] bg-[var(--color-card)] mt-20">
    <div class="max-w-7xl mx-auto px-4 py-8 text-center">
      <p class="text-sm text-[var(--color-muted)]">
        Built with <a href="https://github.com/accretional/statue" class="text-[var(--color-primary)] hover:underline">Statue SSG</a>
      </p>
    </div>
  </footer>
</div>
