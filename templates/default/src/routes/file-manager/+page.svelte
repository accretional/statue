<script lang="ts">
	/**
	 * File Manager Demo Page
	 * Demonstrates the integration of SVAR Svelte File Manager with WillowDark theme
	 */

	import FileManager from 'statue-ssg/components/FileManager.svelte';
	import type { FileItem, DriveInfo } from 'statue-ssg/components/FileManager.svelte';

	// Sample file structure demonstrating various file types and organization
	const sampleData: FileItem[] = [
		// Root folders
		{
			id: "/Documents",
			size: 4096,
			date: new Date(2024, 0, 15, 10, 30),
			type: "folder"
		},
		{
			id: "/Projects",
			size: 4096,
			date: new Date(2024, 0, 14, 14, 22),
			type: "folder"
		},
		{
			id: "/Images",
			size: 4096,
			date: new Date(2024, 0, 13, 9, 15),
			type: "folder"
		},
		{
			id: "/Code",
			size: 4096,
			date: new Date(2024, 0, 12, 16, 45),
			type: "folder"
		},
		{
			id: "/Music",
			size: 4096,
			date: new Date(2024, 0, 11, 11, 0),
			type: "folder"
		},
		// Root files
		{
			id: "/README.md",
			size: 2456,
			date: new Date(2024, 0, 10, 8, 30),
			type: "file"
		},
		{
			id: "/package.json",
			size: 1234,
			date: new Date(2024, 0, 10, 8, 30),
			type: "file"
		},
		// Documents folder contents
		{
			id: "/Documents/Notes.txt",
			size: 512,
			date: new Date(2024, 0, 15, 10, 35),
			type: "file"
		},
		{
			id: "/Documents/Report.pdf",
			size: 1024000,
			date: new Date(2024, 0, 14, 14, 20),
			type: "file"
		},
		{
			id: "/Documents/Meeting",
			size: 4096,
			date: new Date(2024, 0, 13, 9, 0),
			type: "folder"
		},
		// Projects folder contents
		{
			id: "/Projects/website",
			size: 4096,
			date: new Date(2024, 0, 14, 14, 25),
			type: "folder"
		},
		{
			id: "/Projects/app",
			size: 4096,
			date: new Date(2024, 0, 14, 14, 30),
			type: "folder"
		},
		{
			id: "/Projects/design.fig",
			size: 2048000,
			date: new Date(2024, 0, 14, 14, 15),
			type: "file"
		},
		// Images folder contents
		{
			id: "/Images/banner.png",
			size: 524288,
			date: new Date(2024, 0, 13, 9, 20),
			type: "file"
		},
		{
			id: "/Images/logo.svg",
			size: 8192,
			date: new Date(2024, 0, 13, 9, 22),
			type: "file"
		},
		{
			id: "/Images/photos",
			size: 4096,
			date: new Date(2024, 0, 13, 9, 25),
			type: "folder"
		},
		{
			id: "/Images/photos/vacation.jpg",
			size: 2097152,
			date: new Date(2024, 0, 13, 9, 30),
			type: "file"
		},
		// Code folder contents
		{
			id: "/Code/index.ts",
			size: 2048,
			date: new Date(2024, 0, 12, 16, 50),
			type: "file"
		},
		{
			id: "/Code/components",
			size: 4096,
			date: new Date(2024, 0, 12, 16, 55),
			type: "folder"
		},
		{
			id: "/Code/components/Button.svelte",
			size: 1536,
			date: new Date(2024, 0, 12, 17, 0),
			type: "file"
		},
		{
			id: "/Code/components/Card.svelte",
			size: 2048,
			date: new Date(2024, 0, 12, 17, 5),
			type: "file"
		},
		{
			id: "/Code/utils",
			size: 4096,
			date: new Date(2024, 0, 12, 17, 10),
			type: "folder"
		},
		{
			id: "/Code/utils/helpers.ts",
			size: 1024,
			date: new Date(2024, 0, 12, 17, 15),
			type: "file"
		},
		// Music folder contents
		{
			id: "/Music/playlist.m3u",
			size: 256,
			date: new Date(2024, 0, 11, 11, 5),
			type: "file"
		},
		{
			id: "/Music/favorites",
			size: 4096,
			date: new Date(2024, 0, 11, 11, 10),
			type: "folder"
		},
		{
			id: "/Music/favorites/song.mp3",
			size: 5242880,
			date: new Date(2024, 0, 11, 11, 15),
			type: "file"
		},
		// Nested Documents/Meeting folder
		{
			id: "/Documents/Meeting/notes.md",
			size: 1024,
			date: new Date(2024, 0, 13, 9, 5),
			type: "file"
		},
	];

	// Drive information showing storage usage
	const driveInfo: DriveInfo = {
		used: 15200000000, // ~15GB used
		total: 50000000000, // 50GB total
		label: "My Drive"
	};
</script>

<svelte:head>
	<title>File Manager - Statue SSG</title>
	<meta
		name="description"
		content="File Manager demo powered by SVAR Svelte File Manager with WillowDark theme integration."
	/>
</svelte:head>

<div class="file-manager-demo">
	<header class="demo-header">
		<div class="container">
			<h1 class="title">File Manager</h1>
			<p class="description">
				A powerful file explorer component integrated with Statue SSG.
				Browse, organize, and manage your files with an intuitive interface.
			</p>
			<div class="badges">
				<span class="badge">Powered by SVAR</span>
				<span class="badge">WillowDark Theme</span>
				<span class="badge">TypeScript</span>
			</div>
		</div>
	</header>

	<main class="demo-main">
		<div class="container">
			<div class="file-manager-container">
				<FileManager
					data={sampleData}
					drive={driveInfo}
					height="700px"
					fonts={true}
				/>
			</div>

			<section class="features">
				<h2>Features</h2>
				<div class="feature-grid">
					<div class="feature-card">
						<h3>📁 File Operations</h3>
						<p>Create, delete, copy, rename, cut, and paste files and folders</p>
					</div>
					<div class="feature-card">
						<h3>📤 Upload & Download</h3>
						<p>Upload files from your device and download files to your local storage</p>
					</div>
					<div class="feature-card">
						<h3>🌲 Tree View</h3>
						<p>Navigate through folders with an intuitive tree structure</p>
					</div>
					<div class="feature-card">
						<h3>📋 Multiple Views</h3>
						<p>Switch between List, Tiles, and Split views for different workflows</p>
					</div>
					<div class="feature-card">
						<h3>🔍 Search</h3>
						<p>Quickly find files with the built-in search functionality</p>
					</div>
					<div class="feature-card">
						<h3>⌨️ Keyboard Navigation</h3>
						<p>Use keyboard shortcuts for efficient file management</p>
					</div>
				</div>
			</section>

			<section class="usage">
				<h2>Usage</h2>
				<pre class="code-block"><code>&lt;script lang="ts"&gt;
  import FileManager from 'statue-ssg/components/FileManager.svelte';
  import type &#123; FileItem, DriveInfo &#125; from 'statue-ssg/components/FileManager.svelte';

  const data: FileItem[] = [
    &#123; id: "/Documents", type: "folder", date: new Date() &#125;,
    &#123; id: "/README.md", type: "file", size: 1024, date: new Date() &#125;,
  ];

  const drive: DriveInfo = &#123;
    used: 15200000000,
    total: 50000000000,
  &#125;;
&lt;/script&gt;

&lt;FileManager &#123;data&#125; &#123;drive&#125; height="600px" /&gt;</code></pre>
			</section>
		</div>
	</main>
</div>

<style>
	.file-manager-demo {
		min-height: 100vh;
		background: linear-gradient(to bottom, var(--color-hero-from, #0f172a), var(--color-hero-to, #1e293b));
	}

	.demo-header {
		padding: 3rem 1rem 2rem;
		text-align: center;
	}

	.demo-header .container {
		max-width: 800px;
		margin: 0 auto;
	}

	.title {
		font-size: 3rem;
		font-weight: 800;
		color: var(--color-primary, #3b82f6);
		margin-bottom: 1rem;
	}

	.description {
		font-size: 1.125rem;
		color: var(--color-muted, #94a3b8);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	.badges {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.375rem 0.875rem;
		background: rgba(59, 130, 246, 0.15);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 9999px;
		font-size: 0.875rem;
		color: var(--color-primary, #60a5fa);
		font-weight: 500;
	}

	.demo-main {
		padding: 2rem 1rem 4rem;
	}

	.demo-main .container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.file-manager-container {
		background: var(--color-card, rgba(30, 41, 59, 0.5));
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 3rem;
		border: 1px solid var(--color-border, rgba(71, 85, 105, 0.5));
	}

	.features {
		margin-bottom: 3rem;
	}

	.features h2 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-foreground, #f1f5f9);
		text-align: center;
		margin-bottom: 2rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		background: var(--color-card, rgba(30, 41, 59, 0.5));
		border: 1px solid var(--color-border, rgba(71, 85, 105, 0.5));
		border-radius: 12px;
		padding: 1.5rem;
		transition: transform 0.2s, border-color 0.2s;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		border-color: var(--color-primary, rgba(59, 130, 246, 0.5));
	}

	.feature-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #f1f5f9);
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		font-size: 0.9375rem;
		color: var(--color-muted, #94a3b8);
		line-height: 1.6;
	}

	.usage {
		background: var(--color-card, rgba(30, 41, 59, 0.5));
		border: 1px solid var(--color-border, rgba(71, 85, 105, 0.5));
		border-radius: 12px;
		padding: 2rem;
	}

	.usage h2 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-foreground, #f1f5f9);
		margin-bottom: 1.5rem;
	}

	.code-block {
		background: #0d1117;
		border-radius: 8px;
		padding: 1.5rem;
		overflow-x: auto;
		border: 1px solid var(--color-border, rgba(71, 85, 105, 0.5));
	}

	.code-block code {
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #e6edf3;
	}

	@media (max-width: 768px) {
		.title {
			font-size: 2rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
