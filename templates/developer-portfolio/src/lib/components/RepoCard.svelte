<script lang="ts">
	import { Star, GitFork, Code } from 'lucide-svelte';

	export let repo: {
		name: string;
		link: string;
		description: string;
		isPublic: boolean;
		language: string;
		languageColor: string;
		stars: number;
		forks: number;
	};

	// Extract owner/repo from GitHub URL
	$: repoPath = repo.link.replace('https://github.com/', '');
	// Create valid CSS identifier for view-transition-name
	$: transitionName = `repo-${repo.name.replace(/[^a-zA-Z0-9]/g, '-')}`;
</script>

<div class="flex flex-col justify-between p-4 border border-border-default rounded-md bg-canvas-default hover:border-fg-muted transition-colors" style="view-transition-name: {transitionName};">
	<div>
		<div class="flex items-center justify-between mb-2">
			<div class="flex items-center gap-2">
				<a href={repo.link} class="font-semibold text-accent-fg hover:underline break-all">
					{repo.name}
				</a>
				<span class="px-2 py-[2px] text-xs text-fg-muted border border-border-default rounded-full font-medium">
					{repo.isPublic ? 'Public' : 'Private'}
				</span>
			</div>
			<a
				href="/github1s/{repoPath}"
				class="p-1.5 rounded-md text-fg-muted hover:text-accent-fg hover:bg-canvas-subtle transition-colors"
				title="Open in VS Code"
			>
				<Code size={14} />
			</a>
		</div>
		<p class="text-xs text-fg-muted mb-4 line-clamp-2">
			{repo.description}
		</p>
	</div>

	<div class="flex items-center gap-4 text-xs text-fg-muted mt-2">
		<div class="flex items-center gap-1">
			<span class="w-3 h-3 rounded-full" style="background-color: {repo.languageColor}"></span>
			<span>{repo.language}</span>
		</div>

		{#if repo.stars > 0}
			<div class="flex items-center gap-1 hover:text-accent-fg cursor-pointer">
				<Star size={14} />
				<span>{repo.stars}</span>
			</div>
		{/if}

		{#if repo.forks > 0}
			<div class="flex items-center gap-1 hover:text-accent-fg cursor-pointer">
				<GitFork size={14} />
				<span>{repo.forks}</span>
			</div>
		{/if}
	</div>
</div>
