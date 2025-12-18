<script>
	export let title = 'Our Team';
	export let teamMembers = [
		{ name: 'Statue SSG', role: 'Static Site Generator, Web Framework', initials: '🗿' },
		{ name: 'Markdown', role: 'Content Format, Simple Formatting', initials: '.md' },
		{ name: 'Svelte', role: 'General Web Framework, Custom Functionality', initials: '.svelte' }
	];
</script>

<div class="mx-auto mt-24 mb-20 max-w-5xl">
	<h2 class="mb-10 text-center">
		{title}
	</h2>
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		{#each teamMembers as member (member.name)}
			<div class="rounded-xl bg-(--bg-2) p-8 text-center">
				<div class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
					<span class="text-2xl font-bold text-white">{member.initials}</span>
				</div>
				<h3 class="mb-2 text-xl font-bold text-white">{member.name}</h3>
				<p class="text-(--text-2)">{member.role}</p>
			</div>
		{/each}
	</div>
</div>
