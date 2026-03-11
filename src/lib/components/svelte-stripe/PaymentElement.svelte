<!--
This is a Svelte component from svelte-stripe

Website: [sveltestripe.com](https://www.sveltestripe.com/)
GitHub Repository: [joshnuss/svelte-stripe](https://github.com/joshnuss/svelte-stripe)

All components in this directory are sourced from the svelte-stripe project by joshnuss. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type {
    StripePaymentElementOptions as Options,
    StripePaymentElement as Element,
    StripePaymentElementChangeEvent as ChangeEvent,
    StripeError,
    StripePaymentElementCardDetailsChangeEvent as DetailsChangeEvent,
    StripePaymentElementSavedPaymentMethodUpdateEvent as UpdateEvent,
    StripePaymentElementSavedPaymentMethodRemoveEvent as RemoveEvent,
    Stripe,
    StripeElements
  } from '@stripe/stripe-js'
  import { getContext, onMount } from 'svelte'

  interface ElementsContext {
    elements: StripeElements
    stripe: Stripe
  }

  type Events = {
    onchange?: (event: ChangeEvent) => any
    onready?: (event: { elementType: 'payment' }) => any
    onfocus?: (event: { elementType: 'payment' }) => any
    onblur?: (event: { elementType: 'payment' }) => any
    onescape?: (event: { elementType: 'payment' }) => any
    onloaderror?: (event: { elementType: 'payment'; error: StripeError }) => any
    onloaderstart?: (event: { elementType: 'payment' }) => any
    oncarddetailschange?: (event: DetailsChangeEvent) => any
    onsavedpaymentmethodupdate?: (event: UpdateEvent) => any
    onsavedpaymentmethodremove?: (event: RemoveEvent) => any
  }

  type Bindables = {
    element?: Element
  }

  type Props = Options & Events & Bindables

  let {
    element = $bindable(),
    onchange = () => {},
    onready = () => {},
    onfocus = () => {},
    onblur = () => {},
    onescape = () => {},
    onloaderror = () => {},
    onloaderstart = () => {},
    oncarddetailschange = () => {},
    onsavedpaymentmethodupdate = () => {},
    onsavedpaymentmethodremove = () => {},
    ...options
  }: Props = $props()

  let wrapper = $state<HTMLElement>()

  const { elements }: ElementsContext = getContext('stripe')

  onMount(() => {
    element = elements.create('payment', options)

    element.on('change', onchange)
    element.on('ready', onready)
    element.on('focus', onfocus)
    element.on('blur', onblur)
    element.on('escape', onescape)
    element.on('loaderror', onloaderror)
    element.on('loaderstart', onloaderstart)
    element.on('carddetailschange', oncarddetailschange)
    element.on('savedpaymentmethodupdate', onsavedpaymentmethodupdate)
    element.on('savedpaymentmethodremove', onsavedpaymentmethodremove)

    element.mount(wrapper!)

    return () => element?.destroy()
  })

  $effect(() => {
    element?.update(options)
  })

  export function blur() {
    element?.blur()
  }

  export function clear() {
    element?.clear()
  }

  export function destroy() {
    element?.destroy()
  }

  export function focus() {
    element?.focus()
  }

  export function collapse() {
    element?.collapse()
  }
</script>

<div bind:this={wrapper}></div>
