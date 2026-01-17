<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	function preventScroll(prevent: boolean) {
		if (prevent) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function createModalState(initial: {
		isMobile: boolean;
		isActive: boolean;
		sticky: boolean;
	}) {
		let isMobile = $state(initial.isMobile);
		let isActive = $state(initial.isActive);

		function getIsMobile() {
			return isMobile;
		}
		function setIsMobile(value: boolean) {
			isMobile = value;
		}

		function getIsActive() {
			return isActive;
		}
		function setIsActive(value: boolean) {
			isActive = value;
		}

		return {
			sticky: initial.sticky,
			getIsMobile,
			setIsMobile,
			getIsActive,
			setIsActive
		};
	}

	interface Props {
		active: boolean;
		sticky?: boolean;
		children: Snippet;
	}
	let { active = $bindable(false), sticky = false, children }: Props = $props();

	let dialog: HTMLDialogElement;

	const rootState = createModalState({
		isMobile: false,
		isActive: active,
		sticky: sticky
	});

	setContext('modal', rootState);

	$effect(() => {
		active = rootState.getIsActive();
	});

	$effect(() => {
		if (active) {
			dialog.showModal();
			rootState.setIsActive(true);
			preventScroll(active);
		} else {
			rootState.setIsActive(false);
			const id = setTimeout(() => {
				dialog.close();
				clearTimeout(id);
			}, 250);
			preventScroll(active);
		}
	});

	$effect(() => {
		if (window.innerWidth < 767) {
			rootState.setIsMobile(true);
		} else {
			rootState.setIsMobile(false);
		}
		// update when the user is resizing the window
		window.addEventListener('resize', () => {
			if (window.innerWidth < 767) {
				rootState.setIsMobile(true);
			} else {
				rootState.setIsMobile(false);
			}
		});
	});
</script>

<!--Backgrop background-->
{#if active}
	<div
		in:fade|local={{ duration: 100 }}
		out:fade|local={{ duration: 100 }}
		class="fixed top-0 left-0 w-full h-full bg-background bg-opacity-40 z-[1000]"
	></div>
{/if}

<dialog bind:this={dialog}>
	<div in:fade out:fade class="fixed top-0 left-0 w-full h-full flex items-center justify-center">
		{@render children()}
	</div>
</dialog>
