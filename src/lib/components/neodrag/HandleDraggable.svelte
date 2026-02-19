<!--
This is a Svelte component from Neodrag:

Demo Site: [neodrag.dev](https://www.neodrag.dev/)
GitHub Repository: [PuruVJ/neodrag](https://github.com/puruvj/neodrag)

All components in this directory are sourced from the Neodrag project by PuruVJ. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { draggable } from '@neodrag/svelte';
</script>

<div use:draggable={{ handle: '.handle' }}>
	You shall not drag!!
	<div class="handle">This will drag!</div>
</div>
