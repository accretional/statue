<!--
This is a Svelte component from NumberFlow:

Demo Site: [number-flow.barvian.me](https://number-flow.barvian.me/)
GitHub Repository: [barvian/number-flow](https://github.com/barvian/number-flow)

All components in this directory are sourced from the NumberFlow project by barvian. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import type NumberFlowLite from 'number-flow/lite'
	import { type Readable, get } from 'svelte/store'
	import { beforeUpdate, onDestroy, tick, setContext } from 'svelte'

	const groupKey = Symbol('number-flow-group')

	type RegisterWithGroup = (el: Readable<NumberFlowLite | undefined>) => void
	type GroupContext = { register: RegisterWithGroup }

	const flows = new Set<Readable<NumberFlowLite | undefined>>()
	let updating = false

	const registerWithGroup: RegisterWithGroup = (el) => {
		flows.add(el)

		beforeUpdate(async () => {
			if (updating) return
			updating = true
			flows.forEach(async (flow) => {
				{
					const f = get(flow)
					if (!f || !f.created) return
					f.willUpdate()
				}
				await tick()
				// Optional in case the element was removed after tick:
				get(flow)?.didUpdate()
			})
			await tick()
			updating = false
		})

		onDestroy(() => {
			flows.delete(el)
		})
	}

	setContext<GroupContext>(groupKey, { register: registerWithGroup })
</script>

<slot />
