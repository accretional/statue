<!--
This is a Svelte component from svelte-stripe

Website: [sveltestripe.com](https://www.sveltestripe.com/)
GitHub Repository: [joshnuss/svelte-stripe](https://github.com/joshnuss/svelte-stripe)

All components in this directory are sourced from the svelte-stripe project by joshnuss. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { setContext, onMount, type Snippet } from 'svelte'
  import type { Stripe, StripeElements, StripeElementsOptions as Options } from '@stripe/stripe-js'

  type Base = {
    stripe: Stripe
    children: Snippet
  }

  type Events = {
    onupdateend?: () => any
  }

  type Bindables = {
    elements?: StripeElements
  }

  type Props = Base & Options & Events & Bindables

  let {
    stripe,
    elements = $bindable(),
    children,
    onupdateend = () => {},
    ...options
  }: Props = $props()

  onMount(() => {
    // @ts-expect-error
    elements = stripe.elements(options)

    elements.on('update-end', onupdateend)
  })

  $effect(() => {
    elements?.update(options)
  })

  setContext('stripe', {
    get stripe() {
      return stripe
    },
    get elements() {
      return elements
    }
  })
</script>

{#if elements && children}
  {@render children()}
{/if}
