<!--
This is a Svelte component from svelte-stripe

Website: [sveltestripe.com](https://www.sveltestripe.com/)
GitHub Repository: [joshnuss/svelte-stripe](https://github.com/joshnuss/svelte-stripe)

All components in this directory are sourced from the svelte-stripe project by joshnuss. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type {
    StripeIdealBankElementOptions as Options,
    StripeIdealBankElement as Element,
    StripeIdealBankElementChangeEvent as ChangeEvent,
    Stripe,
    StripeElements
  } from '@stripe/stripe-js'
  import { getContext, onMount } from 'svelte'

  interface ElementsContext {
    elements: StripeElements
    stripe: Stripe
  }

  interface Events {
    onchange?: (event: ChangeEvent) => any
    onready?: (event: { elementType: 'idealBank' }) => any
    onfocus?: (event: { elementType: 'idealBank' }) => any
    onblur?: (event: { elementType: 'idealBank' }) => any
    onescape?: (event: { elementType: 'idealBank' }) => any
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
    ...options
  }: Props = $props()

  let wrapper = $state<HTMLElement>()

  const { elements }: ElementsContext = getContext('stripe')

  onMount(() => {
    element = elements.create('idealBank', options)
    element.on('change', onchange)
    element.on('ready', onready)
    element.on('focus', onfocus)
    element.on('blur', onblur)
    element.on('escape', onescape)

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
</script>

<div bind:this={wrapper}></div>
