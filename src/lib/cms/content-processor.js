// Node.js specific modules should only run on the server side
// This file uses mdsvex for markdown processing instead of marked

// Node.js modules
import fs from 'fs';
import path from 'path';
import { compile } from 'mdsvex';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// This error check is to provide an early warning when this module is attempted to be used in the browser
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
if (isBrowser) {
  console.error('content-processor-mdsvex.js should only be used on the server side!');
  throw new Error('Content processor cannot run on the client side!');
}

// Try to load site config, but don't fail if not available
let siteConfig = {};
try {
  const configPath = path.resolve('site.config.json');
  if (fs.existsSync(configPath)) {
    siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch {
  // siteConfig not available, will use empty object
}

// Configure mdsvex options
const mdsvexOptions = {
  extensions: ['.md'],
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug],
  layout: null // We'll handle layout in Svelte components
};

/**
 * Process markdown with mdsvex and extract HTML content
 * Since mdsvex produces Svelte component code, we need to extract just the HTML part
 */
const processMarkdownWithMDSvex = async (markdown) => {
  try {
    const { code } = await compile(markdown, mdsvexOptions);

    // Extract HTML from mdsvex output
    // mdsvex outputs Svelte component code, we need to get the template part
    // The HTML is typically between `<script>` tags (if any) and the end
    let html = code;

    // Remove script tags and their content to get just the template
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove any remaining Svelte-specific directives that might break HTML rendering
    // Keep the HTML structure for {@html} rendering
    html = html.trim();

    return html;
  } catch (error) {
    console.error('MDSvex processing error:', error);
    // Fallback to simple markdown processing if mdsvex fails
    return `<p>Error processing markdown: ${error.message}</p>`;
  }
};

// Function to remove the first h1 heading from HTML content
const removeFirstH1 = (html) => {
  return html.replace(/<h1[^>]*>(.*?)<\/h1>/, '');
};

/**
 * Creates a custom marked-like renderer for link transformation
 * We'll handle this with post-processing since mdsvex uses rehype/remark
 */
const transformLinks = (html, currentDirectory) => {
  // Transform internal .md links
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    // Skip external links and anchors
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      return match;
    }

    // Remove .md extension
    let transformedHref = href;
    if (transformedHref.endsWith('.md')) {
      transformedHref = transformedHref.slice(0, -3);
    }

    // Handle relative paths
    if (transformedHref.startsWith('./') || transformedHref.startsWith('../')) {
      const resolvedPath = path.join('/', currentDirectory, transformedHref);
      transformedHref = resolvedPath.replace(/\\/g, '/').replace(/\/$/, '');
    } else if (!transformedHref.startsWith('/')) {
      transformedHref = path.join('/', currentDirectory, transformedHref).replace(/\\/g, '/');
    }

    return `href="${transformedHref}"`;
  });
};

// Scans all markdown files and folders in the content directory
const scanContentDirectory = async () => {
  const contentPath = path.resolve('content');
  const contentEntries = [];

  if (!fs.existsSync(contentPath)) {
    console.warn('Content folder not found!');
    return contentEntries;
  }

  // Recursively scan the content folder
  async function scanDir(dirPath, relativePath = '') {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const entryRelativePath = path.join(relativePath, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // If it's a folder, scan its contents
        await scanDir(fullPath, entryRelativePath);
      } else if (stats.isFile() && entry.endsWith('.md')) {
        // Add markdown files to the list
        const slug = entry.replace('.md', '');
        const url = relativePath
          ? `/${relativePath}/${slug}`.replace(/\\/g, '/')
          : `/${slug}`;

        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data, content: markdownContent } = matter(content);

        // Process template variables (both in markdown content and metadata)
        const processedMarkdownContent = processTemplateVariables(markdownContent);
        const processedMetadata = {};

        // Process string values in metadata through template processing
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') {
            processedMetadata[key] = processTemplateVariables(value);
          } else {
            processedMetadata[key] = value;
          }
        }

        // Add default values and process them through template processing
        const finalMetadata = {
          title: processedMetadata.title || formatTitle(slug),
          description: processedMetadata.description || '',
          date: processedMetadata.date || null,
          author: processedMetadata.author || null,
          ...processedMetadata
        };

        // Fix directory - use full path
        let directory = relativePath.replace(/\\/g, '/');

        // Process markdown to HTML with mdsvex, then remove the first h1 heading
        let html = await processMarkdownWithMDSvex(processedMarkdownContent);
        html = removeFirstH1(html);
        html = transformLinks(html, directory);

        // Add main directory information to create content tree
        const mainDirectory = directory.split('/')[0] || 'root';

        contentEntries.push({
          slug,
          path: entryRelativePath,
          url,
          directory,
          mainDirectory,
          // Depth of the path
          depth: directory === '' ? 0 : directory.split('/').length,
          content: html,
          metadata: finalMetadata
        });
      }
    }
  }

  // Start scanning the content folder
  await scanDir(contentPath);

  return contentEntries;
};

// Function that detects folders in the content directory
const getContentDirectories = () => {
  const contentPath = path.resolve('content');
  const directories = [];

  if (!fs.existsSync(contentPath)) {
    console.warn('Content folder not found!');
    return directories;
  }

  const entries = fs.readdirSync(contentPath);

  for (const entry of entries) {
    const fullPath = path.join(contentPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      directories.push({
        name: entry,
        path: `content/${entry}`,
        title: formatTitle(entry),
        url: `/${entry}`
      });
    }
  }

  return directories;
};

// Function to create a title from a slug
const formatTitle = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// To scan all content once and cache it
let cachedContent = null;

// Get all content (using cache)
const getAllContent = async () => {
  // Check for development mode to skip caching
  const isDev = process.env.NODE_ENV === 'development' || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV);

  if (!isDev && cachedContent) return cachedContent;

  // In development, we want to scan every time to pick up changes
  if (isDev) {
    // Clear cache to be safe
    cachedContent = null;
  }

  const content = await scanContentDirectory();

  // Only cache in production
  if (!isDev) {
    cachedContent = content;
  }

  return content;
};

// Get content for a specific URL
const getContentByUrl = async (url) => {
  const allContent = await getAllContent();

  // Remove trailing slash (/) from URL
  const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  console.log('Normalized URL for lookup:', normalizedUrl);

  // Check content URLs and find matching content
  const result = allContent.find(entry => {
    // Remove trailing slash from content URL as well
    const entryUrl = entry.url.endsWith('/') ? entry.url.slice(0, -1) : entry.url;
    console.log(`Comparing: "${entryUrl}" vs "${normalizedUrl}"`);
    return entryUrl === normalizedUrl;
  });

  console.log('Match result:', result ? `Found: ${result.url}` : 'Not found');
  return result;
};

// Get content from a specific directory
const getContentByDirectory = async (directory) => {
  const allContent = await getAllContent();

  // Direct matching for main directories
  if (directory === 'root') {
    return allContent.filter(entry => entry.directory === 'root');
  }

  // Get all content that starts with the specified directory, including subdirectories
  return allContent.filter(entry => {
    // 1. Exact match case (e.g., 'blog' directory for 'blog')
    // 2. Subdirectory match (e.g., 'blog/category' directory for 'blog')
    return entry.directory === directory || entry.directory.startsWith(directory + '/');
  });
};

// Clear cache (might be necessary in development mode)
const clearContentCache = () => {
  cachedContent = null;
};

// Function to find subdirectories - returns subdirectories for a specific directory
const getSubDirectories = async (directory) => {
  const allContent = await getAllContent();
  const subdirs = new Set();

  // If not the main directory, filter relevant content
  const contents = allContent.filter(entry =>
    entry.directory !== 'root' &&
    (entry.directory === directory || entry.directory.startsWith(directory + '/'))
  );

  // Extract subdirectories from contents
  contents.forEach(entry => {
    // Get only subdirectories by skipping the main directory
    const relativePath = entry.directory.replace(directory + '/', '');
    if (relativePath && relativePath.includes('/')) {
      // Get the first subdirectory level (e.g., 'blog/category/js' -> 'category')
      const firstLevel = relativePath.split('/')[0];
      subdirs.add(firstLevel);
    }
  });

  return Array.from(subdirs).map(subdir => ({
    name: subdir,
    path: `${directory}/${subdir}`,
    title: formatTitle(subdir),
    url: `/${directory}/${subdir}`
  }));
};

// Function to process template variables
const processTemplateVariables = (content) => {
  // Get variables from configuration (with safe defaults)
  const site = siteConfig.site || {};
  const contact = siteConfig.contact || {};
  const social = siteConfig.social || {};
  const legal = siteConfig.legal || {};

  const variables = {
    // Site information
    'site.name': site.name,
    'site.description': site.description,
    'site.url': site.url,
    'site.author': site.author,

    // Contact information
    'contact.email': contact.email,
    'contact.privacyEmail': contact.privacyEmail,
    'contact.supportEmail': contact.supportEmail,
    'contact.phone': contact.phone,
    'contact.address.street': contact.address?.street,
    'contact.address.city': contact.address?.city,
    'contact.address.state': contact.address?.state,
    'contact.address.zipCode': contact.address?.zipCode,
    'contact.address.country': contact.address?.country,
    'contact.address.full': contact.address
      ? `${contact.address.street || ''}, ${contact.address.city || ''}, ${contact.address.state || ''} ${contact.address.zipCode || ''}`.trim()
      : '',

    // Social media
    'social.twitter': social.twitter,
    'social.github': social.github,
    'social.linkedin': social.linkedin,
    'social.facebook': social.facebook,
    'social.instagram': social.instagram,
    'social.youtube': social.youtube,
    'social.discord': social.discord,
    'social.reddit': social.reddit,

    // Legal information
    'legal.privacyPolicyLastUpdated': legal.privacyPolicyLastUpdated,
    'legal.termsLastUpdated': legal.termsLastUpdated,
    'legal.doNotSell.processingTime': legal.doNotSell?.processingTime,

    // Dynamic date functions
    'date.now': new Date().toLocaleDateString('en-US'),
    'date.year': new Date().getFullYear().toString(),
    'date.month': new Date().toLocaleDateString('en-US', { month: 'long' }),
    'date.day': new Date().getDate().toString()
  };

  // Replace template variables
  // Support {{variable.name}} format variables
  let processedContent = content;

  // Process {{variable}} format variables
  processedContent = processedContent.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    if (Object.hasOwn(variables, trimmedName)) {
      return variables[trimmedName];
    }
    console.warn(`Template variable not found: ${trimmedName}`);
    return match; // Leave unfound variables as they are
  });

  return processedContent;
};

// Function to build sidebar navigation tree for a directory
const getSidebarTree = async (directory) => {
  const allContent = await getAllContent();

  // Filter content for this directory
  const directoryContent = allContent.filter(entry =>
    entry.directory === directory || entry.directory.startsWith(directory + '/')
  );

  // Group by subdirectory
  const groups = {};

  directoryContent.forEach(entry => {
    // Get relative path from the main directory
    const relativePath = entry.directory === directory
      ? ''
      : entry.directory.replace(directory + '/', '');

    const parts = relativePath.split('/').filter(Boolean);
    const groupKey = parts[0] || '_root';

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: groupKey === '_root' ? formatTitle(directory) : formatTitle(groupKey),
        items: []
      };
    }

    groups[groupKey].items.push({
      title: entry.metadata.title,
      url: entry.url,
      order: entry.metadata.order || 999
    });
  });

  // Sort items within each group
  Object.values(groups).forEach(group => {
    group.items.sort((a, b) => a.order - b.order);
  });

  // Convert to sidebar format
  const result = [];

  // Add root items first
  if (groups._root) {
    groups._root.items.forEach(item => {
      result.push(item);
    });
    delete groups._root;
  }

  // Add grouped items
  Object.entries(groups).forEach(([key, group]) => {
    result.push({
      title: group.title,
      children: group.items
    });
  });

  return result;
};

// Function to get all directories as sidebar navigation
const getAllDirectoriesSidebar = async () => {
  const directories = getContentDirectories();
  const result = [];

  directories.forEach(dir => {
    const dirContent = getSidebarTree(dir.name);
    if (dirContent.length > 0) {
      result.push({
        title: dir.title,
        url: dir.url,
        children: dirContent
      });
    }
  });

  return result;
};

// Export functions
export {
  scanContentDirectory,
  getContentDirectories,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories,
  processTemplateVariables,
  getSidebarTree,
  getAllDirectoriesSidebar
};
