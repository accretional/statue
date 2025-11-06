<script lang="ts">
  export let buttonText: string = 'Upgrade';
  export let description: string = '';
  export let onClose: (() => void) | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  export let containerClass: string = '';
  export let descriptionClass: string = '';
  export let buttonClass: string = '';
  export let closeButtonClass: string = '';
  
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

<div class={containerClass}>
  <div class="flex items-center justify-between gap-4">
    <div class="flex-1">
      <p class={descriptionClass}>
        {description}
      </p>
    </div>
    
    <div class="flex items-center gap-2">
      <button
        on:click={handleClick}
        class={buttonClass}
      >
        {buttonText}
      </button>
      
      {#if onClose}
        <button
          on:click={handleClose}
          class={closeButtonClass}
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
