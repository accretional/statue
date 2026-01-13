<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';

	$: repoPath = $page.params.repo;
	$: github1sUrl = `https://github1s.com/${repoPath}`;
	$: repoName = repoPath.split('/').pop() || repoPath;
	// Match the view-transition-name from RepoCard
	$: transitionName = `repo-${repoName.replace(/[^a-zA-Z0-9]/g, '-')}`;

	// Hide navbar on mount, show on unmount
	onMount(() => {
		document.body.classList.add('github1s-page');
		return () => {
			document.body.classList.remove('github1s-page');
		};
	});
</script>

<svelte:head>
	<title>{repoName} - VS Code Editor</title>
	<meta name="description" content="View {repoName} source code in VS Code editor" />
</svelte:head>

<div class="github1s-container" style="view-transition-name: {transitionName};">
	<!-- Back button notch -->
	<a href="/" class="back-notch">
		<ArrowLeft size={16} />
		<span>Back to Home Page</span>
	</a>

	<!-- iframe -->
	<iframe
		src={github1sUrl}
		title="{repoName} - VS Code Editor"
		class="github1s-iframe"
		allow="clipboard-read; clipboard-write"
	></iframe>
</div>

<style>
	/* Hide navbar when on github1s page */
	:global(body.github1s-page nav) {
		display: none !important;
	}
	:global(body.github1s-page main) {
		padding-top: 0 !important;
	}

	.github1s-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--color-background);
	}

	.back-notch {
		position: absolute;
		top: 0;
		left: 1rem;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		background-color: var(--color-card);
		border: 1px solid var(--color-border);
		border-top: none;
		border-radius: 0 0 12px 12px;
		color: var(--color-muted);
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.back-notch:hover {
		background-color: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}

	.github1s-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>

