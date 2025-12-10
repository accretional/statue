<script>
  let { code, language = 'javascript', filename = '' } = $props();
  let copied = $state(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Basit syntax highlighting
  function highlight(code) {
    return code
      .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="token-string">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
      .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="token-function">$1</span>(');
  }
</script>

<div class="rounded-xl overflow-hidden bg-[var(--bg-code)] shadow-xl">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/10">
    <div class="flex items-center gap-2">
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
        <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
        <span class="w-3 h-3 rounded-full bg-[#27ca40]"></span>
      </div>
      {#if filename}
        <span class="ml-3 font-mono text-xs text-gray-400">{filename}</span>
      {/if}
    </div>

    <div class="flex items-center gap-2">
      <span class="font-mono text-xs text-gray-500">{language}</span>
      <button
        onclick={copyCode}
        class="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        title="Kopyala"
      >
        {#if copied}
          <svg class="w-4 h-4 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Code -->
  <div class="p-4 overflow-x-auto">
    <pre class="font-mono text-sm leading-relaxed text-gray-200"><code>{@html highlight(code)}</code></pre>
  </div>
</div>