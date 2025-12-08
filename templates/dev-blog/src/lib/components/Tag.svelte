<script>
  let { text, active = false, onclick = null } = $props();
</script>

{#if onclick}
  <button
    {onclick}
    class="px-3 py-1.5 rounded-lg font-mono text-xs transition-all
      {active
        ? 'bg-[var(--accent-primary)] text-white shadow-md'
        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] border border-[var(--border-color)]'
      }"
  >
    {text}
  </button>
{:else}
  <span class="px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
    #{text}
  </span>
{/if}