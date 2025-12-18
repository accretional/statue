<script>
	import Button from './ui/Button.svelte';
</script>

<div class="mission-wrapper mx-auto mb-20 max-w-2xl">
	<h2 class="mb-10 text-center">Our Mission</h2>
	<div
		class="rounded-xl border border-(--divider) bg-(--bg)/50 p-8 text-(--text-2) backdrop-blur-sm"
	>
		<p class="mb-6">
			At
			<Button href="https://accretional.com" variant="link">Accreational</Button>
			, we believe that content creation should be simple, fast, and accessible to everyone. Our mission
			with Statue is to empower creators with tools that turn Markdown content into beautiful, high-performance
			websites without requiring deep technical knowledge.
		</p>
		<p>
			We're committed to maintaining open-source tools that prioritize performance, security, and
			user experience. Modify this component on your own site by overriding its props!
			<Button
				href="https://github.com/accretional/statue/blob/main/src/lib/components/Mission.svelte"
				variant="link"
			>
				View the component definition here.
			</Button>
		</p>
	</div>
</div>
