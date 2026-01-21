<script lang="ts">
  import type { NotificationBannerProps } from './types';

  type Props = NotificationBannerProps & {
    buttonText?: string;
    onClose?: (() => void) | undefined;
    onClick?: (() => void) | undefined;
    containerClass?: string;
    descriptionClass?: string;
    buttonClass?: string;
    closeButtonClass?: string;
  };

  let {
    message = '',
    type = 'info',
    dismissible = false,
    buttonText = 'Upgrade',
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
        {message}
      </p>
    </div>

    <div class="banner-actions">
      <button
        onclick={handleClick}
        class="action-button {buttonClass}"
      >
        {buttonText}
      </button>

      {#if dismissible && onClose}
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
  .banner-container {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
  }

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
    color: var(--color-foreground);
  }

  .banner-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-button:hover {
    background-color: var(--color-secondary);
  }

  .close-button {
    padding: 0.5rem;
    background-color: transparent;
    color: var(--color-muted);
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-foreground);
  }

  .close-icon {
    width: 1rem;
    height: 1rem;
  }
</style>
