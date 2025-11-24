<!--
  CopyCommand Component - Copy-to-clipboard command display with horizontal scrolling
-->

<script>
  import { browser } from '$app/environment';
  
  // Command to display and copy
  export let command = '';

  // Style customization
  export let maxWidth = '800px';
  export let copiedText = 'Copied!';
  export let copiedDuration = 1000;
  export let wrapperClass = '';
  export let commandClass = '';

  // State for showing copied indicator
  let showCopied = false;

  /**
   * Copies the command to the clipboard and shows the indicator
   */
  async function copyToClipboard() {
    // Guard against SSR
    if (!browser) return;
    
    if (!command) {
      console.warn('CopyCommand: No command provided to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(command);

      // Show copied indicator
      showCopied = true;

      // Hide after specified duration
      setTimeout(() => {
        showCopied = false;
      }, copiedDuration);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  /**
   * Handle keyboard interaction
   */
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyToClipboard();
    }
  }
</script>

<div
  class="copy-command-wrapper {wrapperClass}"
  style="max-width: {maxWidth};"
>
  <div
    class="copy-command {commandClass}"
    on:click={copyToClipboard}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
    aria-label="Copy command to clipboard"
  >
    <svg
      class="copy-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>

    <span class="command-text">
      {command}
    </span>
  </div>

  <!-- Copied Indicator -->
  <div
    class="copied-indicator"
    class:show={showCopied}
    role="status"
    aria-live="polite"
  >
    {copiedText}
  </div>
</div>

<style>
  .copy-command-wrapper {
    margin: 2rem auto 0;
    padding: 0 1rem 3rem;
    position: relative;
  }

  .copy-command {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1rem 1.5rem;
    background: var(--copy-bg, rgba(31, 41, 55, 0.5));
    border: 1px solid var(--copy-border, #374151);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .copy-command:hover {
    border-color: var(--copy-border-hover, rgba(255, 255, 255, 0.8));
    background: var(--copy-bg-hover, rgba(31, 41, 55, 0.7));
  }

  .copy-command:focus {
    outline: 2px solid var(--copy-outline, rgba(255, 255, 255, 0.8));
    outline-offset: 2px;
  }

  /* Custom scrollbar styling for WebKit browsers */
  .copy-command::-webkit-scrollbar {
    height: 8px;
  }

  .copy-command::-webkit-scrollbar-track {
    background: var(--copy-scrollbar-track, rgba(31, 41, 55, 0.3));
    border-radius: 4px;
  }

  .copy-command::-webkit-scrollbar-thumb {
    background: var(--copy-scrollbar-thumb, rgba(255, 255, 255, 0.6));
    border-radius: 4px;
  }

  .copy-command::-webkit-scrollbar-thumb:hover {
    background: var(--copy-scrollbar-thumb-hover, rgba(255, 255, 255, 0.8));
  }

  /* Firefox scrollbar */
  .copy-command {
    scrollbar-width: thin;
    scrollbar-color: var(--copy-scrollbar-thumb, rgba(255, 255, 255, 0.6)) var(--copy-scrollbar-track, rgba(31, 41, 55, 0.3));
  }

  .copy-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--copy-icon-color, rgba(255, 255, 255, 0.6));
    transition: color 0.2s ease;
  }

  .copy-command:hover .copy-icon {
    color: var(--copy-icon-hover-color, rgba(255, 255, 255, 0.9));
  }

  .command-text {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
    font-size: 0.875rem;
    color: var(--copy-text-color, rgba(255, 255, 255, 0.8));
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    user-select: all;
  }

  /* Copied Indicator */
  .copied-indicator {
    position: absolute;
    bottom: 0.5rem;
    left: 1.5rem;
    padding: 0.5rem 1rem;
    background: var(--copied-bg, rgba(255, 255, 255, 0.9));
    color: var(--copied-text-color, black);
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-5px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 10;
    white-space: nowrap;
  }

  .copied-indicator.show {
    opacity: 1;
    transform: translateY(0);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .copy-command-wrapper {
      padding: 0 0.5rem 3rem;
    }

    .copy-command {
      padding: 0.875rem 1rem;
      gap: 0.5rem;
    }

    .command-text {
      font-size: 0.8125rem;
    }

    .copied-indicator {
      bottom: 0.5rem;
      left: 1rem;
      font-size: 0.8125rem;
      padding: 0.4rem 0.875rem;
    }
  }
</style>
