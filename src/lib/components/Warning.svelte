<script>
  export let warning;
  
  // Determine style based on warning type
  $: warningClass = getWarningClass(warning?.type || 'info');
  
  function getWarningClass(type) {
    switch (type) {
      case 'error':
        return 'warning-error';
      case 'warning':
        return 'warning-warning';
      case 'success':
        return 'warning-success';
      case 'info':
      default:
        return 'warning-info';
    }
  }
  
  function getIconPath(type) {
    switch (type) {
      case 'error':
        return 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z';
      case 'warning':
        return 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z';
      case 'success':
        return 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'info':
      default:
        return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z';
    }
  }
</script>

{#if warning && (warning.title || warning.message)}
  <div class="mb-8 p-4 border-l-4 rounded-r-lg {warningClass}">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d={getIconPath(warning.type)} />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        {#if warning.title}
          <h3 class="text-sm font-medium mb-1">
            {warning.title}
          </h3>
        {/if}
        {#if warning.message}
          <div class="text-sm opacity-90">
            {warning.message}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if} 
<style>
  /* Warning component styles using theme variables */
  .warning-error {
    background: color-mix(in srgb, var(--color-accent) 20%, transparent);
    border-color: var(--color-accent);
    color: var(--color-foreground);
  }

  .warning-warning {
    background: color-mix(in srgb, var(--color-primary) 20%, transparent);
    border-color: var(--color-primary);
    color: var(--color-foreground);
  }

  .warning-success {
    background: color-mix(in srgb, var(--color-accent) 20%, transparent);
    border-color: var(--color-accent);
    color: var(--color-foreground);
  }

  .warning-info {
    background: color-mix(in srgb, var(--color-primary) 20%, transparent);
    border-color: var(--color-primary);
    color: var(--color-foreground);
  }
</style>
