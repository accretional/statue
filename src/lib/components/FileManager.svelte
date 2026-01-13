<script lang="ts">
	/**
	 * FileManager - A wrapper component for SVAR Svelte File Manager
	 * Integrates the @svar-ui/svelte-filemanager with WillowDark theme
	 */

	import { Filemanager, WillowDark } from "@svar-ui/svelte-filemanager";

	// Type aliases for external types that may not be properly resolved
	type ParsedEntity = any;
	type ExtraInfo = any;
	type FileMenuOption = any;
	type ContextMenuType = any;
	type FileManagerApi = any;

	/**
	 * Represents a file or folder item in the file manager
	 */
	export interface FileItem {
		/** Unique identifier (path) */
		id: string;
		/** File size in bytes */
		size?: number;
		/** Last modified date */
		date?: Date;
		/** Type: 'file' or 'folder' */
		type: "file" | "folder";
		/** Optional parent folder path */
		parent?: string;
	}

	/**
	 * Drive/storage information
	 */
	export interface DriveInfo {
		/** Used storage in bytes */
		used: number;
		/** Total storage in bytes */
		total: number;
		/** Optional drive label */
		label?: string;
	}

	/**
	 * Component props interface
	 */
	export interface Props {
		/** Array of files and folders to display */
		data: FileItem[];
		/** Optional drive/storage information */
		drive?: DriveInfo;
		/** Whether the file manager is read-only */
		readonly?: boolean;
		/** Custom icon provider for files */
		icons?: (file: ParsedEntity, size: "big" | "small") => string;
		/** Custom preview provider for files */
		previews?: (
			file: ParsedEntity | { type: "search" | "multiple" | "none" },
			width: number,
			height: number
		) => string | null;
		/** Extra info provider for file details */
		extraInfo?: (file: ParsedEntity) => Promise<ExtraInfo> | ExtraInfo | null;
		/** Custom menu options provider */
		menuOptions?: (
			mode: ContextMenuType,
			item?: ParsedEntity
		) => FileMenuOption[];
		/** Initialization callback with API access */
		init?: (api: FileManagerApi) => void;
		/** Component height */
		height?: string;
		/** Whether to include theme fonts */
		fonts?: boolean;
	}

	let {
		data,
		drive,
		readonly = false,
		icons,
		previews,
		extraInfo,
		menuOptions,
		init,
		height = "600px",
		fonts = true
	}: Props = $props();

	// Convert FileItem[] to the format expected by Filemanager (using $derived for Svelte 5 runes)
	const normalizedData = $derived(data.map((item) => ({
		...item,
		size: item.size ?? (item.type === "folder" ? 4096 : 0),
		date: item.date ?? new Date()
	})));
</script>

<div class="filemanager-wrapper" style:height={height}>
	<WillowDark {fonts}>
		<Filemanager
			data={normalizedData}
			drive={drive}
			{readonly}
			{icons}
			{previews}
			{extraInfo}
			{menuOptions}
			{init}
		/>
	</WillowDark>
</div>

<style>
	.filemanager-wrapper {
		width: 100%;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--color-border, #384047);
	}

	/* Custom scrollbar for dark theme */
	.filemanager-wrapper :global(.wx-filemanager) {
		font-family: system-ui, -apple-system, sans-serif;
	}

	/* Dark mode overrides */
	:global(.wx-willow-dark-theme) {
		--wx-fm-background: #1a1f2e;
		--wx-fm-box-shadow: none;
		--wx-fm-grid-border: 1px solid #2d3540;
		--wx-fm-grid-header-color: #1a1f2e;
		--wx-fm-button-font-color: #9fa1ae;
		--wx-fm-toolbar-height: 56px;
		color-scheme: dark;
	}
</style>
