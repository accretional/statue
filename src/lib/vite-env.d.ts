/// <reference types="@sveltejs/kit" />

// Type declarations for @svar-ui/svelte-filemanager
declare module "@svar-ui/svelte-filemanager" {
	import type { Component } from "svelte";

	export const Filemanager: Component<any>;
	export const WillowDark: Component<{ fonts?: boolean; children?: any }>;
	export const Willow: Component<{ fonts?: boolean; children?: any }>;
	export const Material: Component<{ fonts?: boolean; children?: any }>;
}

declare module "@svar-ui/filemanager-store" {
	export type TContextMenuType = any;
	export type IExtraInfo = any;
	export type IParsedEntity = any;
	export type IApi = any;
	export type IFileMenuOption = any;
}
