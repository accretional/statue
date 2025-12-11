<script lang="ts">
  interface Props {
    buttonText?: string;
    description: string;
    onClose?: (() => void) | undefined;
    onClick?: (() => void) | undefined;
    containerClass?: string;
    descriptionClass?: string;
    buttonClass?: string;
    closeButtonClass?: string;
  }

  let {
    buttonText = 'Upgrade',
    description = '',
    onClose = undefined,
    onClick = undefined,
    containerClass = '',
    descriptionClass = '',
    buttonClass = '',
    closeButtonClass = ''
  }: Props = $props();
  
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

<div class="banner-container {containerClass}">
  <div class="banner-content">
    <div class="banner-description">
      <p class="description-text {descriptionClass}">
        {description}
      </p>
    </div>

    <div class="banner-actions">
      <button
        onclick={handleClick}
        class="action-button {buttonClass}"
      >
        {buttonText}
      </button>

      {#if onClose}
        <button
          onclick={handleClose}
          class="close-button {closeButtonClass}"
          aria-label="Close banner"
        >
          <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .banner-description {
    flex: 1;
    min-width: 200px;
  }

  .description-text {
    margin: 0;
    line-height: 1.5;
  }

  .banner-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-button {
    cursor: pointer;
  }

  .close-button {
    cursor: pointer;
  }

  .close-icon {
    width: 1rem;
    height: 1rem;
  }
</style>
