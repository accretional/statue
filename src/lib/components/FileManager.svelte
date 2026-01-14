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
		border-radius: 0 !important;
		overflow: hidden;
		border: none !important;
		box-shadow: none !important;
	}

	/* Remove outer borders and border-radius from file manager container */
	.filemanager-wrapper :global(.wx-filemanager) {
		border-radius: 0 !important;
		border: none !important;
		box-shadow: none !important;
	}

	/* Remove borders from theme container */
	.filemanager-wrapper :global(.wx-willow-dark-theme) {
		border-radius: 0 !important;
		border: none !important;
		box-shadow: none !important;
	}

	/* Custom scrollbar for dark theme */
	.filemanager-wrapper :global(.wx-filemanager) {
		font-family: system-ui, -apple-system, sans-serif;
	}

	/* Map SVAR File Manager colors to Statue theme variables - use !important to override in dev mode */
	:global(.wx-willow-dark-theme) {
		/* Background colors */
		--wx-fm-background: var(--color-background, #000000) !important;
		--wx-fm-box-shadow: none !important;

		/* Border colors - set to transparent/none */
		--wx-fm-grid-border: none !important;
		--wx-grid-border: none !important;

		/* Header/toolbar colors */
		--wx-fm-grid-header-color: var(--color-card, #1a1a1a) !important;

		/* Text colors */
		--wx-fm-button-font-color: var(--color-foreground, #ffffff) !important;
		--wx-text-color: var(--color-foreground, #ffffff) !important;
		--wx-text-color-muted: var(--color-muted, #999999) !important;

		/* Primary/brand color - used for selections, active states, etc. */
		--wx-color-primary: var(--color-primary, #dc2626) !important;
		--wx-color-primary-light: var(--color-secondary, #ef4444) !important;
		--wx-color-primary-dark: var(--color-accent, #b91c1c) !important;

		/* Button colors - fix text visibility */
		--wx-button-background: var(--color-primary, #dc2626) !important;
		--wx-button-font-color: var(--color-on-primary, #ffffff) !important;
		--wx-button-border: none !important;

		/* Window/panel switch button - use secondary for contrast */
		--wx-color-secondary: var(--color-secondary, #ef4444) !important;
		--wx-color-secondary-font: var(--color-on-primary, #ffffff) !important;

		/* Selection colors */
		--wx-fm-select-color: var(--color-primary, #dc2626) !important;
		--wx-table-select-background: color-mix(in srgb, var(--color-primary, #dc2626) 15%, transparent) !important;
		--wx-table-select-focus-background: color-mix(in srgb, var(--color-primary, #dc2626) 25%, transparent) !important;

		/* Card/surface colors */
		--wx-card-background: var(--color-card, #1a1a1a) !important;
		--wx-card-border: none !important;

		/* Icon colors */
		--wx-icon-color: var(--color-muted, #999999) !important;
		--wx-icon-color-hover: var(--color-foreground, #ffffff) !important;

		/* Focus/hover states */
		--wx-focus-border: var(--color-primary, #dc2626) !important;
		--wx-hover-background: var(--color-card, #1a1a1a) !important;

		--wx-fm-toolbar-height: 56px !important;
		color-scheme: dark !important;
	}
</style>
