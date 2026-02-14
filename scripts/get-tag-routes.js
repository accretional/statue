import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get all tag routes for prerendering
export function getTagRoutes() {
  const contentDir = path.resolve('./content');
  const tagRoutes = new Set();

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

  processDirectory(contentDir);

  // Add the tags index route if we have any tags
  if (tagRoutes.size > 0) {
    tagRoutes.add('/tags');
  }

  return Array.from(tagRoutes);
}