/**
 * Theme exports - Re-exported from virtual module
 * 
 * The actual theme data is parsed at build time by the statue-themes Vite plugin
 * from the configuration in site.config.js. This module provides a clean
 * re-export interface that works in both browser and server contexts.
 * 
 * No filesystem operations at runtime!
 */

// Re-export everything from the virtual module
export { themes, defaultTheme, showSelector } from 'virtual:statue-themes';

// Re-export the type
export type { ThemeDefinition } from 'virtual:statue-themes';
