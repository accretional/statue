// Dynamic markdown component loader
// Uses Vite's import.meta.glob to load .md files as Svelte components

// Glob import all markdown files from content directory
const modules = import.meta.glob('/content/**/*.md');

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
  // If no content found by server, return early
  if (!data.content || data.notFound) {
    return data;
  }

  const componentPath = data.content.componentPath;

  // Try to load the markdown component
  if (componentPath && modules[componentPath]) {
    try {
      const module = await modules[componentPath]();
      return {
        ...data,
        ContentComponent: module.default
      };
    } catch (error) {
      console.error('Failed to load markdown component:', componentPath, error);
    }
  }

  return data;
}
