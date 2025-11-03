<script lang="ts">
  export let buttonText: string = 'Upgrade';
  export let description: string = '';
  export let onClose: (() => void) | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }
  
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
</script>

<div class="relative w-full rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div class="flex items-center justify-between gap-4">
    <div class="flex-1">
      <p class="text-sm text-blue-900">
        {description}
      </p>
    </div>
    
    <div class="flex items-center gap-2">
      <button
        on:click={handleClick}
        class="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1.5 rounded-md"
      >
        {buttonText}
      </button>
      
      {#if onClose}
        <button
          on:click={handleClose}
          class="rounded-md p-1 text-blue-900 hover:bg-blue-100 transition-colors"
          aria-label="Close banner"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>
