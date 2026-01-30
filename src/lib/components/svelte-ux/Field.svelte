<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { mdiClose, mdiInformationOutline } from '@mdi/js';
  import { uniqueId } from 'lodash-es';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  type LabelPlacement = 'inset' | 'float' | 'top' | 'left';
  const DEFAULT_LABEL_PLACEMENT: LabelPlacement = 'top';

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

  const dispatch = createEventDispatcher<{
    clear: null;
  }>();

  export let label = '';
  export let labelPlacement: LabelPlacement = DEFAULT_LABEL_PLACEMENT;
  export let value: any = null;
  export let placeholder = '';
  export let error: string | string[] | boolean | undefined = '';
  export let hint = '';
  export let disabled = false;
  export let clearable = false;
  export let base = false;
  export let rounded = false;
  export let dense = false;
  export let icon: string | null = null;
  export let iconRight: string | null = null;
  export let center = false;
  export let classes: {
    root?: string;
    container?: string;
    label?: string;
    input?: string;
    error?: string;
    prepend?: string;
    append?: string;
  } = {};

  $: hasValue = Array.isArray(value)
    ? value.length > 0
    : !!value /* anything truthy such as object, non-empty string, etc */;
  $: hasInsetLabel = ['inset', 'float'].includes(labelPlacement) && label !== '';

  $: hasPrepend = $$slots.prepend || icon != null;
  $: hasAppend = $$slots.append || iconRight != null || clearable || error;

  export let id = uniqueId('field-');
  let labelEl: HTMLLabelElement | null = null;
</script>

<label
  for={id}
  role="group"
  class={cn(
    'Field',
    'group flex gap-1',
    labelPlacement !== 'left' ? 'flex-col' : 'items-center',
    error ? '[--color:theme(colors.danger)]' : '[--color:theme(colors.primary)]',
    disabled && 'opacity-50 pointer-events-none',
    !base && (rounded ? 'rounded-full' : 'rounded'),
    classes.root,
    $$props.class
  )}
  bind:this={labelEl}
>
  {#if label && ['top', 'left'].includes(labelPlacement)}
    <span
      class={cn(
        'label',
        'block text-sm font-medium',
        'truncate group-hover:text-surface-content/70 group-focus-within:text-primary group-hover:group-focus-within:text-[var(--color)] cursor-pointer',
        error ? 'text-danger/80' : 'text-surface-content/50',
        `placement-${labelPlacement}`,
        classes.label
      )}
    >
      {label}
    </span>
  {/if}

  <div class="flex-1">
    <div
      class={cn(
        'border py-0 transition-shadow',
        disabled ? '' : 'hover:shadow',
        disabled ? '' : error ? 'hover:border-danger' : 'hover:border-surface-content',
        {
          'px-2': !rounded,
          'px-6': rounded && !hasPrepend,
        },
        !base && ['bg-surface-100', rounded ? 'rounded-full' : 'rounded'],
        error && 'border-danger',
        'group-focus-within:shadow-md group-focus-within:border-[var(--color)]',
        classes.container
      )}
    >
      <div class="flex items-center">
        {#if hasPrepend}
          <div
            class={cn(
              'prepend flex items-center whitespace-nowrap',
              classes.prepend
            )}
          >
            <slot name="prepend" />

            {#if icon}
              <span class={cn('mr-3', rounded && !$$slots.prepend && 'ml-3')}>
                <Icon data={icon} class="text-surface-content/50" />
              </span>
            {/if}
          </div>
        {/if}

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="flex-grow inline-grid" on:click>
          {#if label && ['inset', 'float'].includes(labelPlacement)}
            <span
              class={cn(
                'label',
                'col-span-full row-span-full z-[1] flex items-center h-full truncate origin-top-left transition-all duration-200 group-hover:text-surface-content/70 group-focus-within:text-[var(--color)] group-hover:group-focus-within:text-[var(--color)] cursor-pointer',
                center && 'justify-center',
                error ? 'text-danger/80' : 'text-surface-content/50',
                `placement-${labelPlacement}`,
                (labelPlacement === 'inset' || hasValue) && 'shrink',
                classes.label
              )}
            >
              {label}
            </span>
          {/if}

          <div
            class={cn(
              'input col-span-full row-span-full flex items-center',
              hasInsetLabel && 'pt-4',
              dense ? 'my-1' : 'my-2',
              center && 'text-center',
              classes.input
            )}
          >
            <slot name="prefix" />

            <slot {id}>
              {#if value}
                {value}
              {:else if placeholder}
                <span class="text-surface-content/50">
                  {placeholder}
                </span>
              {:else}
                &nbsp
              {/if}
            </slot>

            <slot name="suffix" />
          </div>
        </div>

        {#if hasAppend}
          <div
            class={cn(
              'append flex items-center whitespace-nowrap',
              classes.append
            )}
          >
            {#if clearable && hasValue}
              <Button
                icon={mdiClose}
                {disabled}
                class="text-surface-content/50 p-1"
                on:click={() => {
                  value = Array.isArray(value) ? [] : typeof value === 'string' ? '' : null;
                  dispatch('clear');
                  labelEl?.focus();
                }}
              />
            {/if}

            <slot name="append" />

            {#if error}
              <Icon data={mdiInformationOutline} class="text-danger" />
            {:else if iconRight}
              <Icon data={iconRight} class="text-surface-content/50" />
            {/if}
          </div>
        {/if}
      </div>
    </div>
    <div
      class={cn(
        error ? 'error' : 'hint',
        'text-xs ml-2 transition-transform ease-out overflow-hidden origin-top transform group-focus-within:scale-y-100',
        error ? 'text-danger' : 'text-surface-content/50 scale-y-0',
        classes.error
      )}
    >
      {error && error != true ? error : hint}
    </div>
  </div>

  <slot name="root" />
</label>

<style lang="postcss">
  .Field:focus-within .label.placement-float,
  .label.shrink {
    transform: scale(0.75);
    width: 133%; /* offset 75% scale */
    height: 32px;
  }
</style>
