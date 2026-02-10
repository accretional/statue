<script>
  export let type = "info";
</script>

<div class="callout callout-{type}">
  <slot />
</div>

<style>
.callout {
  padding: 1rem;
  border-left: 4px solid var(--color-primary);
  background: var(--color-card);
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
.callout-info {
  border-color: var(--color-primary);
}
.callout-warning {
  border-color: var(--color-warning, orange);
}
</style>

