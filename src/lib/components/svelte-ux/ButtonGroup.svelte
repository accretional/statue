<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" context="module">
  import { setContext, getContext } from 'svelte';

  type ButtonVariant = 'default' | 'outline' | 'fill' | 'fill-outline' | 'fill-light' | 'text' | 'none';
  type ButtonColor = 'default' | 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  type ButtonSize = 'sm' | 'md' | 'lg';
  type ButtonRounded = boolean | 'full';

  type ButtonGroupContext = {
    variant: ButtonVariant | undefined;
    size: ButtonSize | undefined;
    color: ButtonColor | undefined;
    rounded: ButtonRounded | undefined;
  };

  const buttonGroupKey = Symbol();

  export function setButtonGroup(value: ButtonGroupContext | undefined) {
    setContext(buttonGroupKey, value);
  }

  export function getButtonGroup() {
    return getContext<ButtonGroupContext | undefined>(buttonGroupKey);
  }
</script>

<script lang="ts">
  function cn(...inputs: any[]): string {
    return inputs
      .flat()
      .filter(Boolean)
      .map(input => {
        if (typeof input === 'string') return input;
        if (typeof input === 'object') {
          return Object.entries(input)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }

  export let variant: ButtonVariant | undefined = undefined;
  export let size: ButtonSize | undefined = undefined;
  export let color: ButtonColor | undefined = undefined;
  export let rounded: ButtonRounded | undefined = undefined;
  export let disabled: boolean = false;
  let className: string | undefined = undefined;
  export { className as class };

  $: _class = cn(
    'ButtonGroup',
    'inline-flex',
    disabled && 'opacity-50 pointer-events-none',
    `variant-${variant}`, // used for per-variant group overrides in `style`

    /* Remove left/right rounding if Button is not first/last, or if is a child of an element that is first/last (ex. wrapped in span for menu/tooltip/etc) */
    '[&_.Button:not(:first-child)]:rounded-l-none',
    '[&_.Button:not(:last-child)]:rounded-r-none',
    '[&_:not(:first-child)_.Button]:rounded-l-none',
    '[&_:not(:last-child)_.Button]:rounded-r-none',

    /* Overlap borders to allow selection styling per Button.  Should be used with z-index */
    '[&.variant-outline_.Button:not(:first-child)]:-ml-px',
    '[&.variant-outline_:not(:first-child)_.Button]:-ml-px',
    '[&.variant-fill-outline_.Button:not(:first-child)]:-ml-px',
    '[&.variant-fill-outline_:not(:first-child)_.Button]:-ml-px',

    /* Add gap between buttons (default, filled) */
    '[&.variant-default_.Button:not(:first-child)]:ml-px',
    '[&.variant-default_:not(:first-child)_.Button]:ml-px',
    '[&.variant-fill_.Button:not(:first-child)]:ml-px',
    '[&.variant-fill_:not(:first-child)_.Button]:ml-px',
    '[&.variant-fill-light_.Button:not(:first-child)]:ml-px',
    '[&.variant-fill-light_:not(:first-child)_.Button]:ml-px',

    className
  );

  setButtonGroup({
    variant,
    size,
    color,
    rounded,
  });
</script>

<div role="group" class={_class} {...$$restProps}>
  <slot />
</div>
