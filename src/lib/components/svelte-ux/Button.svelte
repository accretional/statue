<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { multi, type Actions } from '@layerstack/svelte-actions';

  import Icon from './Icon.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getButtonGroup } from './ButtonGroup.svelte';

  type ButtonVariant = 'default' | 'outline' | 'fill' | 'fill-outline' | 'fill-light' | 'text' | 'none';
  type ButtonColor = 'default' | 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  type ButtonSize = 'sm' | 'md' | 'lg';
  type ButtonRounded = boolean | 'full';
  type IconInput = any;

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

  function asIconData(icon: IconInput) {
    if (typeof icon === 'string') {
      return icon;
    }
    if (icon && typeof icon === 'object') {
      if ('icon' in icon) {
        // FontAwesome IconDefinition
        return icon;
      }
      if ('path' in icon) {
        return icon;
      }
    }
    return icon;
  }

  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let fullWidth: boolean = false;
  export let icon: IconInput = undefined;
  export let iconOnly = icon !== undefined && !$$slots.default;
  export let actions: Actions<HTMLAnchorElement | HTMLButtonElement> | undefined = undefined;

  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let rounded: ButtonRounded | undefined = undefined; // default in reactive groupContext below
  export let variant: ButtonVariant | undefined = undefined; // default in reactive groupContext below
  export let size: ButtonSize | undefined = undefined; // default in reactive groupContext below
  export let color: ButtonColor | undefined = undefined; // default in reactive groupContext below

  /** @type {{root?: string, icon?: string, loading?: string}} */
  export let classes: {
    root?: string;
    icon?: string;
    loading?: string;
  } = {};

  // Override default from `ButtonGroup` if set
  const groupContext = getButtonGroup();
  $: variant = variant ?? groupContext?.variant ?? 'default';
  $: size = size ?? groupContext?.size ?? 'md';
  $: color = color ?? groupContext?.color ?? 'default';
  $: rounded = rounded ?? groupContext?.rounded ?? (iconOnly ? 'full' : true);

  $: _class = cn(
    'Button',
    'transition duration-200 ring-surface-content/60 touch-manipulation',
    'focus:outline-none focus-visible:ring-1',
    fullWidth ? 'flex w-full' : 'inline-flex',
    loading ? 'gap-2' : 'gap-1',
    variant === 'none' || !rounded ? '' : rounded === 'full' ? 'rounded-full' : 'rounded',
    variant !== 'none' && [
      'items-center justify-center',
      'font-medium tracking-wider whitespace-nowrap',
      iconOnly
        ? {
            sm: 'text-xs p-1',
            md: 'text-sm p-2',
            lg: 'text-base p-3',
          }[size!]
        : {
            sm: 'text-xs px-2 py-1',
            md: 'text-sm px-4 py-2',
            lg: 'text-base px-6 py-3',
          }[size!],
    ],
    disabled && 'opacity-50 pointer-events-none',
    // Variant specific styles
    `variant-${variant}`,
    {
      default: '',
      outline: 'border focus-visible:ring-offset-1',
      fill: 'focus-visible:ring-offset-1',
      'fill-outline': 'border focus-visible:ring-offset-1',
      'fill-light': '',
      text: 'p-0',
      none: '',
    }[variant ?? 'none'],

    // Variant specific colors
    {
      default: {
        default: [
          'hover:[--bg-color:theme(colors.surface-content/10%)]',
          // '[--text-color:theme(colors.surface-content)]', // inherit
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          'hover:[--bg-color:theme(colors.primary/10%)]',
          '[--text-color:theme(colors.primary)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          'hover:[--bg-color:theme(colors.secondary/10%)]',
          '[--text-color:theme(colors.secondary)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          'hover:[--bg-color:theme(colors.accent/10%)]',
          '[--text-color:theme(colors.accent)]',
          '[--ring-color:theme(colors.accent/60%)]',
        ],
        neutral: [
          'hover:[--bg-color:theme(colors.neutral/10%)]',
          '[--text-color:theme(colors.neutral)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          'hover:[--bg-color:theme(colors.info/10%)]',
          '[--text-color:theme(colors.info)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          'hover:[--bg-color:theme(colors.success/10%)]',
          '[--text-color:theme(colors.success)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          'hover:[--bg-color:theme(colors.warning/10%)]',
          '[--text-color:theme(colors.warning)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          'hover:[--bg-color:theme(colors.danger/10%)]',
          '[--text-color:theme(colors.danger)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      outline: {
        default: [
          'hover:[--bg-color:theme(colors.surface-content/10%)]',
          '[--border-color:theme(colors.surface-content)]',
          '[--text-color:theme(colors.surface-content)]',
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          'hover:[--bg-color:theme(colors.primary/10%)]',
          '[--border-color:theme(colors.primary)]',
          '[--text-color:theme(colors.primary)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          'hover:[--bg-color:theme(colors.secondary/10%)]',
          '[--border-color:theme(colors.secondary)]',
          '[--text-color:theme(colors.secondary)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          'hover:[--bg-color:theme(colors.accent/10%)]',
          '[--border-color:theme(colors.accent)]',
          '[--text-color:theme(colors.accent)]',
          '[--ring-color:theme(colors.accent/60%)]',
        ],
        neutral: [
          'hover:[--bg-color:theme(colors.neutral/10%)]',
          '[--border-color:theme(colors.neutral)]',
          '[--text-color:theme(colors.neutral)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          'hover:[--bg-color:theme(colors.info/10%)]',
          '[--border-color:theme(colors.info)]',
          '[--text-color:theme(colors.info)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          'hover:[--bg-color:theme(colors.success/10%)]',
          '[--border-color:theme(colors.success)]',
          '[--text-color:theme(colors.success)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          'hover:[--bg-color:theme(colors.warning/10%)]',
          '[--border-color:theme(colors.warning)]',
          '[--text-color:theme(colors.warning)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          'hover:[--bg-color:theme(colors.danger/10%)]',
          '[--border-color:theme(colors.danger)]',
          '[--text-color:theme(colors.danger)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      fill: {
        default: [
          `[--bg-color:theme(colors.surface-content)]`,
          'hover:[--bg-color:theme(colors.surface-content/80%)]',
          '[--text-color:theme(colors.surface-200)]',
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          `[--bg-color:theme(colors.primary)]`,
          'hover:[--bg-color:theme(colors.primary-600)]',
          '[--text-color:theme(colors.primary-content)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          '[--bg-color:theme(colors.secondary)]',
          'hover:[--bg-color:theme(colors.secondary-600)]',
          '[--text-color:theme(colors.secondary-content)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          '[--bg-color:theme(colors.accent)]',
          'hover:[--bg-color:theme(colors.accent-600)]',
          '[--text-color:theme(colors.accent-content)]',
          '[--ring-color:theme(colors.accent/60%)]',
        ],
        neutral: [
          '[--bg-color:theme(colors.neutral)]',
          'hover:[--bg-color:theme(colors.neutral-600)]',
          '[--text-color:theme(colors.neutral-content)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          `[--bg-color:theme(colors.info)]`,
          'hover:[--bg-color:theme(colors.info-600)]',
          '[--text-color:theme(colors.info-content)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          `[--bg-color:theme(colors.success)]`,
          'hover:[--bg-color:theme(colors.success-600)]',
          '[--text-color:theme(colors.success-content)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          `[--bg-color:theme(colors.warning)]`,
          'hover:[--bg-color:theme(colors.warning-600)]',
          '[--text-color:theme(colors.warning-content)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          `[--bg-color:theme(colors.danger)]`,
          'hover:[--bg-color:theme(colors.danger-600)]',
          '[--text-color:theme(colors.danger-content)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      'fill-light': {
        default: [
          '[--bg-color:theme(colors.surface-content/10%)]',
          'hover:[--bg-color:theme(colors.surface-content/20%)]',
          '[--text-color:theme(colors.surface-content)]',
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          '[--bg-color:theme(colors.primary/10%)]',
          'hover:[--bg-color:theme(colors.primary/20%)]',
          '[--text-color:theme(colors.primary)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          '[--bg-color:theme(colors.secondary/10%)]',
          'hover:[--bg-color:theme(colors.secondary/20%)]',
          '[--text-color:theme(colors.secondary)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          '[--bg-color:theme(colors.accent/10%)]',
          'hover:[--bg-color:theme(colors.accent/20%)]',
          '[--text-color:theme(colors.accent)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        neutral: [
          '[--bg-color:theme(colors.neutral/10%)]',
          'hover:[--bg-color:theme(colors.neutral/20%)]',
          '[--text-color:theme(colors.neutral)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          '[--bg-color:theme(colors.info/10%)]',
          'hover:[--bg-color:theme(colors.info/20%)]',
          '[--text-color:theme(colors.info)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          '[--bg-color:theme(colors.success/10%)]',
          'hover:[--bg-color:theme(colors.success/20%)]',
          '[--text-color:theme(colors.success)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          '[--bg-color:theme(colors.warning/10%)]',
          'hover:[--bg-color:theme(colors.warning/20%)]',
          '[--text-color:theme(colors.warning)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          '[--bg-color:theme(colors.danger/10%)]',
          'hover:[--bg-color:theme(colors.danger/20%)]',
          '[--text-color:theme(colors.danger)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      'fill-outline': {
        default: [
          '[--bg-color:theme(colors.surface-content/10%)]',
          'hover:[--bg-color:theme(colors.surface-content/20%)]',
          '[--border-color:theme(colors.surface-content)]',
          '[--text-color:theme(colors.surface-content)]',
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          '[--bg-color:theme(colors.primary/10%)]',
          'hover:[--bg-color:theme(colors.primary/20%)]',
          '[--border-color:theme(colors.primary)]',
          '[--text-color:theme(colors.primary)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          '[--bg-color:theme(colors.secondary/10%)]',
          'hover:[--bg-color:theme(colors.secondary/20%)]',
          '[--border-color:theme(colors.secondary)]',
          '[--text-color:theme(colors.secondary)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          '[--bg-color:theme(colors.accent/10%)]',
          'hover:[--bg-color:theme(colors.accent/20%)]',
          '[--border-color:theme(colors.accent)]',
          '[--text-color:theme(colors.accent)]',
          '[--ring-color:theme(colors.accent/60%)]',
        ],
        neutral: [
          '[--bg-color:theme(colors.neutral/10%)]',
          'hover:[--bg-color:theme(colors.neutral/20%)]',
          '[--border-color:theme(colors.neutral)]',
          '[--text-color:theme(colors.neutral)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          '[--bg-color:theme(colors.info/10%)]',
          'hover:[--bg-color:theme(colors.info/20%)]',
          '[--border-color:theme(colors.info)]',
          '[--text-color:theme(colors.info)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          '[--bg-color:theme(colors.success/10%)]',
          'hover:[--bg-color:theme(colors.success/20%)]',
          '[--border-color:theme(colors.success)]',
          '[--text-color:theme(colors.success)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          '[--bg-color:theme(colors.warning/10%)]',
          'hover:[--bg-color:theme(colors.warning/20%)]',
          '[--border-color:theme(colors.warning)]',
          '[--text-color:theme(colors.warning)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          '[--bg-color:theme(colors.danger/10%)]',
          'hover:[--bg-color:theme(colors.danger/20%)]',
          '[--border-color:theme(colors.danger)]',
          '[--text-color:theme(colors.danger)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      text: {
        default: [
          '[--text-color:theme(colors.surface-content)]',
          'hover:[--text-color:theme(colors.surface-content/80%)]',
          '[--ring-color:theme(colors.surface-content/60%)]',
        ],
        primary: [
          '[--text-color:theme(colors.primary)]',
          'hover:[--text-color:theme(colors.primary-700)]',
          '[--ring-color:theme(colors.primary/60%)]',
        ],
        secondary: [
          '[--text-color:theme(colors.secondary)]',
          'hover:[--text-color:theme(colors.secondary-700)]',
          '[--ring-color:theme(colors.secondary/60%)]',
        ],
        accent: [
          '[--text-color:theme(colors.accent)]',
          'hover:[--text-color:theme(colors.accent-700)]',
          '[--ring-color:theme(colors.accent/60%)]',
        ],
        neutral: [
          '[--text-color:theme(colors.neutral)]',
          'hover:[--text-color:theme(colors.neutral-700)]',
          '[--ring-color:theme(colors.neutral/60%)]',
        ],
        info: [
          '[--text-color:theme(colors.info)]',
          'hover:[--text-color:theme(colors.info-700)]',
          '[--ring-color:theme(colors.info/60%)]',
        ],
        success: [
          '[--text-color:theme(colors.success)]',
          'hover:[--text-color:theme(colors.success-700)]',
          '[--ring-color:theme(colors.success/60%)]',
        ],
        warning: [
          '[--text-color:theme(colors.warning)]',
          'hover:[--text-color:theme(colors.warning-700)]',
          '[--ring-color:theme(colors.warning/60%)]',
        ],
        danger: [
          '[--text-color:theme(colors.danger)]',
          'hover:[--text-color:theme(colors.danger-700)]',
          '[--ring-color:theme(colors.danger/60%)]',
        ],
      },
      none: {
        default: '',
        primary: '',
        secondary: '',
        accent: '',
        neutral: '',
        info: '',
        success: '',
        warning: '',
        danger: '',
      },
    }[variant ?? 'none']?.[color ?? 'default'],

    // text color
    ['default', 'outline', 'fill', 'fill-outline', 'fill-light', 'text'].includes(
      variant ?? 'none'
    ) && 'text-[var(--text-color)]',

    // background color
    ['default', 'outline', 'fill', 'fill-outline', 'fill-light'].includes(variant ?? 'none') &&
      'bg-[var(--bg-color)] ',

    // border color
    ['outline', 'fill-outline'].includes(variant ?? 'none') && 'border-[var(--border-color)]',

    // ring color
    ['default', 'outline', 'fill', 'fill-outline', 'fill-light', 'text'].includes(
      variant ?? 'none'
    ) && 'ring-[var(--ring-color)]',

    classes?.root,
    $$props.class
  );
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={href ? 'a' : 'button'}
  {href}
  {target}
  {type}
  {...$$restProps}
  class={_class}
  style={$$props.style ?? ''}
  {disabled}
  aria-disabled={disabled ? 'true' : 'false'}
  use:multi={actions}
  on:click
  on:mouseover
  on:mouseout
  on:focus
  on:blur
>
  {#if loading}
    <span transition:slide={{ axis: 'x', duration: 200 }}>
      <ProgressCircle size={16} width={2} class={cn(classes.loading)} />
    </span>
  {:else if icon}
    <span in:slide={{ axis: 'x', duration: 200 }}>
      {#if typeof icon === 'string' || 'icon' in icon}
        <!-- font path/url/etc or font-awesome IconDefinition -->
        <Icon
          data={asIconData(icon)}
          class={cn('pointer-events-none', classes.icon)}
        />
      {:else}
        <Icon class={cn('pointer-events-none', classes.icon)} {...icon} />
      {/if}
    </span>
  {/if}

  <slot />
</svelte:element>
