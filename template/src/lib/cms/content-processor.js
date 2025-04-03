// Node.js specific modules should only run on the server side
// This file should only be imported on the server side

// Node.js modules
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// This error check is to provide an early warning when this module is attempted to be used in the browser
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
if (isBrowser) {
  console.error('content-processor.js should only be used on the server side!');
  throw new Error('Content processor cannot run on the client side!');
}

// Scans all markdown files and folders in the content directory
const scanContentDirectory = () => {
  const contentPath = path.resolve('content');
  const contentEntries = [];
  
  if (!fs.existsSync(contentPath)) {
    console.warn('Content folder not found!');
    return contentEntries;
  }
  
  // Recursively scan the content folder
  function scanDir(dirPath, relativePath = '') {
    const entries = fs.readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const entryRelativePath = path.join(relativePath, entry);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // If it's a folder, scan its contents
        scanDir(fullPath, entryRelativePath);
      } else if (stats.isFile() && entry.endsWith('.md')) {
        // Add markdown files to the list
        const slug = entry.replace('.md', '');
        const url = relativePath 
          ? `/${relativePath}/${slug}`.replace(/\\/g, '/') 
          : `/${slug}`;
          
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        const html = marked.parse(markdownContent);
        
        // Fix directory - use full path
        let directory = relativePath.replace(/\\/g, '/');
        
        // Add main directory information to create content tree
        // Example: blog/categories/js -> blog
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
          metadata: {
            title: data.title || formatTitle(slug),
            description: data.description || '',
            date: data.date || null,
            author: data.author || null,
            ...data
          }
        });
      }
    }
  }
  
  // Start scanning the content folder
  scanDir(contentPath);
  
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

// Function that shortens markdown content up to a specific length
const truncateContent = (content, maxLength = 200) => {
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength) + '...';
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
const getAllContent = () => {
  if (cachedContent) return cachedContent;
  
  cachedContent = scanContentDirectory();
  return cachedContent;
};

// Get content for a specific URL
const getContentByUrl = (url) => {
  const allContent = getAllContent();
  
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
const getContentByDirectory = (directory) => {
  const allContent = getAllContent();
  
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
const getSubDirectories = (directory) => {
  const allContent = getAllContent();
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

// Export functions
export {
  scanContentDirectory,
  getContentDirectories,
  truncateContent,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories
}; 