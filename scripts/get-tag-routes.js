import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get all tag routes for prerendering
// Only supports default template - other templates do not have tag functionality
export function getTagRoutes() {
  const siteConfigPath = path.resolve('./site.config.json');

  // Check if tags are enabled in site config (default template only)
  let tagsEnabled = false; // Default to false for safety
  if (fs.existsSync(siteConfigPath)) {
    try {
      const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
      tagsEnabled = siteConfig.blog?.blogTag?.enabled === true;
    } catch (error) {
      console.warn('Warning: Could not parse site.config.json:', error.message);
      return [];
    }
  }

  // Return empty array if tags are disabled
  if (!tagsEnabled) {
    return [];
  }

  const tagRoutes = new Set();
  const contentDir = path.resolve('./content');
  const blogDir = path.join(contentDir, 'blog');

  // Verify this is a default template by checking if blog directory exists
  if (!fs.existsSync(blogDir)) {
    console.warn('Warning: blog directory not found. Tags are only supported in the default template.');
    return [];
  }

  function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(content);

          if (data.tags && Array.isArray(data.tags)) {
            for (const tag of data.tags) {
              const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
              tagRoutes.add(`/tags/${tagSlug}`);
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not process ${fullPath}:`, error.message);
        }
      }
    }
  }

  // Only process the blog directory (default template only)
  processDirectory(blogDir);

  // Add the tags index route if we have any tags
  if (tagRoutes.size > 0) {
    tagRoutes.add('/tags');
  }

  return Array.from(tagRoutes);
}