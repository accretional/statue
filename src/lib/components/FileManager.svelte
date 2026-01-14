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
		/* Main backgrounds - use theme colors */
		--wx-background: var(--color-card, #1a1a1a) !important;
		--wx-background-alt: var(--color-background, #000000) !important;
		--wx-background-hover: var(--color-background, #000000) !important;

		/* File manager specific backgrounds */
		--wx-fm-background: var(--color-background, #000000) !important;
		--wx-fm-box-shadow: none !important;

		/* Border colors - set to transparent/none */
		--wx-fm-grid-border: none !important;
		--wx-grid-border: none !important;
		--wx-border: 1px solid var(--color-border, #333333) !important;
		--wx-border-light: 1px solid var(--color-border, #333333) !important;
		--wx-border-medium: 1px solid var(--color-border, #333333) !important;

		/* Header/toolbar colors */
		--wx-fm-grid-header-color: var(--color-card, #1a1a1a) !important;

		/* Text colors */
		--wx-fm-button-font-color: var(--color-foreground, #ffffff) !important;
		--wx-text-color: var(--color-foreground, #ffffff) !important;
		--wx-text-color-muted: var(--color-muted, #999999) !important;

		/* Font colors from theme */
		--wx-color-font: var(--color-foreground, #ffffff) !important;
		--wx-color-font-alt: var(--color-muted, #999999) !important;
		--wx-color-font-disabled: var(--color-muted, #999999) !important;

		/* Primary/brand color - used for selections, active states, etc. */
		--wx-color-primary: var(--color-primary, #dc2626) !important;
		--wx-color-primary-selected: color-mix(in srgb, var(--color-primary, #dc2626) 30%, transparent) !important;
		--wx-color-primary-light: var(--color-secondary, #ef4444) !important;
		--wx-color-primary-dark: var(--color-accent, #b91c1c) !important;
		--wx-color-primary-font: var(--color-on-primary, #ffffff) !important;

		/* Secondary color - lighter version of primary (70% transparent) */
		--wx-color-secondary: color-mix(in srgb, var(--color-primary, #dc2626) 70%, transparent) !important;
		--wx-color-secondary-hover: color-mix(in srgb, var(--color-primary, #dc2626) 85%, transparent) !important;
		--wx-color-secondary-font: var(--color-foreground, #ffffff) !important;
		--wx-color-secondary-font-hover: var(--color-foreground, #ffffff) !important;
		--wx-color-secondary-border: var(--color-primary, #dc2626) !important;

		/* Disabled color */
		--wx-color-disabled: color-mix(in srgb, var(--color-foreground, #ffffff) 30%, transparent) !important;

		/* Button colors - fix text visibility */
		--wx-button-background: var(--color-primary, #dc2626) !important;
		--wx-button-font-color: var(--color-on-primary, #ffffff) !important;
		--wx-button-border: none !important;
		--wx-button-border-radius: 4px !important;

		/* Input backgrounds */
		--wx-input-background: var(--color-background, #000000) !important;
		--wx-input-background-disabled: var(--color-card, #1a1a1a) !important;
		--wx-input-placeholder-color: var(--color-muted, #999999) !important;
		--wx-input-border: 1px solid var(--color-border, #333333) !important;
		--wx-input-border-focus: 1px solid var(--color-primary, #dc2626) !important;
		--wx-input-border-disabled: 1px solid var(--color-border, #333333) !important;

		/* Card/surface colors */
		--wx-card-background: var(--color-card, #1a1a1a) !important;
		--wx-card-border: none !important;

		/* Icon colors */
		--wx-icon-color: var(--color-muted, #999999) !important;
		--wx-icon-color-hover: var(--color-foreground, #ffffff) !important;

		/* Focus/hover states */
		--wx-focus-border: var(--color-primary, #dc2626) !important;
		--wx-hover-background: var(--color-card, #1a1a1a) !important;

		/* Selection colors */
		--wx-fm-select-color: var(--color-primary, #dc2626) !important;
		--wx-fm-select-background: var(--color-card, #1a1a1a) !important;
		--wx-table-select-background: color-mix(in srgb, var(--color-primary, #dc2626) 15%, transparent) !important;
		--wx-table-select-focus-background: color-mix(in srgb, var(--color-primary, #dc2626) 25%, transparent) !important;

		/* Other overrides */
		--wx-fm-toolbar-height: 56px !important;
		color-scheme: dark !important;
	}
</style>
