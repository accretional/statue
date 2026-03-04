<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  export let id: string;

  export let width: number;
  export let height: number;
</script>

<defs>
  <pattern {id} {width} {height} patternUnits="userSpaceOnUse" {...$$restProps}>
    <slot />
  </pattern>
</defs>
