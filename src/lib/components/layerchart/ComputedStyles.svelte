<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { computedStyles } from '@layerstack/svelte-actions';
  import { cls } from '@layerstack/tailwind';

  let className: string | undefined = undefined;
  export { className as class };

  let styles: CSSStyleDeclaration;
</script>

<div
  class={cls('ComputedStyles hidden', className)}
  use:computedStyles={(_styles) => (styles = _styles)}
></div>

<slot {styles} />
