declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

declare module '*.png' {
  const value: string;
  export default value;
}

/**
 * Virtual module provided by statue-themes Vite plugin
 * Contains parsed theme data from site.config.js theme configuration
 */
declare module 'virtual:statue-themes' {
  export interface ThemeDefinition {
    /** Unique theme identifier (kebab-case) */
    id: string;
    /** Display name for the theme */
    name: string;
    /** CSS color variables for the theme */
    colors: Record<string, string>;
  }

  /** Array of all configured themes */
  export const themes: ThemeDefinition[];
  
  /** The default theme ID from site.config.js */
  export const defaultTheme: string;
  
  /** Whether to show the theme selector (true if multiple themes configured) */
  export const showSelector: boolean;
}

/**
 * Virtual CSS module containing all theme styles
 */
declare module 'virtual:statue-themes.css' {
  const css: string;
  export default css;
} 