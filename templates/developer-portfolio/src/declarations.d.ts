declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'statue-ssg';
declare module 'statue-ssg/*';
