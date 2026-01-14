<script lang="ts">
	import FileManager from 'statue-ssg/components/FileManager.svelte';
	import type { FileItem } from 'statue-ssg/components/FileManager.svelte';

	const sampleData: FileItem[] = [
		{ id: "/Documents", size: 4096, date: new Date(2024, 0, 15, 10, 30), type: "folder" },
		{ id: "/Projects", size: 4096, date: new Date(2024, 0, 14, 14, 22), type: "folder" },
		{ id: "/Images", size: 4096, date: new Date(2024, 0, 13, 9, 15), type: "folder" },
		{ id: "/Code", size: 4096, date: new Date(2024, 0, 12, 16, 45), type: "folder" },
		{ id: "/Music", size: 4096, date: new Date(2024, 0, 11, 11, 0), type: "folder" },
		{ id: "/README.md", size: 2456, date: new Date(2024, 0, 10, 8, 30), type: "file" },
		{ id: "/package.json", size: 1234, date: new Date(2024, 0, 10, 8, 30), type: "file" },
		{ id: "/Documents/Notes.txt", size: 512, date: new Date(2024, 0, 15, 10, 35), type: "file" },
		{ id: "/Documents/Report.pdf", size: 1024000, date: new Date(2024, 0, 14, 14, 20), type: "file" },
		{ id: "/Documents/Meeting", size: 4096, date: new Date(2024, 0, 13, 9, 0), type: "folder" },
		{ id: "/Projects/website", size: 4096, date: new Date(2024, 0, 14, 14, 25), type: "folder" },
		{ id: "/Projects/app", size: 4096, date: new Date(2024, 0, 14, 14, 30), type: "folder" },
		{ id: "/Projects/design.fig", size: 2048000, date: new Date(2024, 0, 14, 14, 15), type: "file" },
		{ id: "/Images/banner.png", size: 524288, date: new Date(2024, 0, 13, 9, 20), type: "file" },
		{ id: "/Images/logo.svg", size: 8192, date: new Date(2024, 0, 13, 9, 22), type: "file" },
		{ id: "/Images/photos", size: 4096, date: new Date(2024, 0, 13, 9, 25), type: "folder" },
		{ id: "/Images/photos/vacation.jpg", size: 2097152, date: new Date(2024, 0, 13, 9, 30), type: "file" },
		{ id: "/Code/index.ts", size: 2048, date: new Date(2024, 0, 12, 16, 50), type: "file" },
		{ id: "/Code/components", size: 4096, date: new Date(2024, 0, 12, 16, 55), type: "folder" },
		{ id: "/Code/components/Button.svelte", size: 1536, date: new Date(2024, 0, 12, 17, 0), type: "file" },
		{ id: "/Code/components/Card.svelte", size: 2048, date: new Date(2024, 0, 12, 17, 5), type: "file" },
		{ id: "/Code/utils", size: 4096, date: new Date(2024, 0, 12, 17, 10), type: "folder" },
		{ id: "/Code/utils/helpers.ts", size: 1024, date: new Date(2024, 0, 12, 17, 15), type: "file" },
		{ id: "/Music/playlist.m3u", size: 256, date: new Date(2024, 0, 11, 11, 5), type: "file" },
		{ id: "/Music/favorites", size: 4096, date: new Date(2024, 0, 11, 11, 10), type: "folder" },
		{ id: "/Music/favorites/song.mp3", size: 5242880, date: new Date(2024, 0, 11, 11, 15), type: "file" },
		{ id: "/Documents/Meeting/notes.md", size: 1024, date: new Date(2024, 0, 13, 9, 5), type: "file" },
	];
</script>

<svelte:head>
	<title>File Manager - Statue SSG</title>
	<meta name="description" content="File Manager demo powered by SVAR Svelte File Manager" />
</svelte:head>

<div class="file-manager-page">
	<h1 class="page-title">File Manager</h1>
	<FileManager data={sampleData} height="calc(100vh - 80px)" />
</div>

<style>
	.file-manager-page {
		width: 100%;
		max-width: 100%;
		padding: 0;
		margin: 0;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-foreground, #ffffff);
		padding: 1rem 1.5rem;
		margin: 0;
	}
</style>
