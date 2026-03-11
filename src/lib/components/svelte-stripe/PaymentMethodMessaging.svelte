<!--
This is a Svelte component from svelte-stripe

Website: [sveltestripe.com](https://www.sveltestripe.com/)
GitHub Repository: [joshnuss/svelte-stripe](https://github.com/joshnuss/svelte-stripe)

All components in this directory are sourced from the svelte-stripe project by joshnuss. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type {
    StripePaymentMethodMessagingElementOptions as Options,
    StripePaymentMethodMessagingElement as Element,
    Stripe,
    StripeElements
  } from '@stripe/stripe-js'
  import { getContext, onMount } from 'svelte'

  interface ElementsContext {
    elements: StripeElements
    stripe: Stripe
  }

  type Events = {
    onready?: (event: { elementType: 'paymentMethodMessaging' }) => any
  }

  type Bindables = {
    element?: Element
  }

  type Props = Options & Events & Bindables

  let { element = $bindable(), onready = () => {}, ...options }: Props = $props()

  let wrapper = $state<HTMLElement>()

  const { elements }: ElementsContext = getContext('stripe')

  onMount(() => {
    element = elements.create('paymentMethodMessaging', options)
    element.on('ready', onready)

    element.mount(wrapper!)

    return () => element?.destroy()
  })

  $effect(() => {
    element?.update(options)
  })
</script>

<div bind:this={wrapper}></div>
