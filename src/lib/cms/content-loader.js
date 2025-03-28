import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// Function that automatically detects all subdirectories in the content folder
function detectContentDirectories() {
  const contentPath = path.resolve('content');
  const directories = [];
  
  if (fs.existsSync(contentPath)) {
    const items = fs.readdirSync(contentPath);
    
    items.forEach(item => {
      const itemPath = path.join(contentPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        directories.push({
          name: item,
          path: `content/${item}`,
          title: formatTitle(item),
          outputDir: item === 'pages' ? '' : item
        });
      }
    });
  }
  
  return directories;
}

// Helper function that creates a title format from slug
function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function that processes Markdown content
function processMarkdown(content) {
  return marked.parse(content);
}

// Function that loads all page groups
export async function loadPageGroups() {
  // Detect content directories
  const contentDirs = detectContentDirectories();
  
  // Create a page group for each directory
  const pageGroups = contentDirs.map(dir => ({
    name: dir.name,
    title: dir.title,
    sourceDir: dir.path,
    outputDir: dir.outputDir,
    listable: true,
    hierarchical: dir.name === 'docs', // Hierarchical view active for Docs
    pages: []
  }));
  
  // Load content for each page group
  for (const pageGroup of pageGroups) {
    await loadPagesForGroup(pageGroup);
  }
  
  // Create navbar items
  const navbarItems = contentDirs.map(dir => ({
    title: dir.title,
    url: `/${dir.outputDir}`
  }));
  
  return {
    pageGroups,
    navbarItems
  };
}

// Function that loads all pages for a page group
async function loadPagesForGroup(pageGroup) {
  const sourceDir = path.resolve(pageGroup.sourceDir);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Source directory ${sourceDir} (${pageGroup.name} page group) not found.`);
    return;
  }
  
  const files = getAllFiles(sourceDir);
  
  for (const file of files) {
    if (path.extname(file) === '.md') {
      const relativePath = path.relative(sourceDir, file);
      const url = `/${pageGroup.outputDir}/${relativePath.replace(/\.md$/, '')}`;
      const slug = path.basename(file, '.md');
      
      const content = fs.readFileSync(file, 'utf-8');
      const { data, content: markdownContent } = matter(content);
      
      const page = {
        slug,
        path: relativePath,
        url,
        content: processMarkdown(markdownContent),
        metadata: data
      };
      
      pageGroup.pages.push(page);
    }
  }
}

// Helper function that lists all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function that loads a page by slug in a specific page group
export async function loadPageBySlug(groupName, slug) {
  const { pageGroups } = await loadPageGroups();
  const pageGroup = pageGroups.find(group => group.name === groupName);
  
  if (!pageGroup) {
    return null;
  }
  
  const page = pageGroup.pages.find(p => p.slug === slug);
  return page;
}

// Function that loads all pages in a page group
export async function loadPageGroup(groupName) {
  const { pageGroups, navbarItems } = await loadPageGroups();
  const pageGroup = pageGroups.find(group => group.name === groupName);
  
  if (!pageGroup) {
    return null;
  }
  
  // Organize pages for hierarchical view
  const organizedPages = {};
  
  if (pageGroup.hierarchical) {
    pageGroup.pages.forEach(page => {
      const pathParts = page.path.split('/');
      // Remove the last part (file name)
      pathParts.pop();
      
      const parentPath = pathParts.join('/');
      
      if (!organizedPages[parentPath]) {
        organizedPages[parentPath] = {
          path: parentPath,
          pages: []
        };
      }
      
      organizedPages[parentPath].pages.push({
        title: page.metadata.title || formatTitle(page.slug),
        url: page.url,
        description: page.metadata.description,
        date: page.metadata.date
      });
    });
  }
  
  return {
    pageGroup,
    navbarItems,
    organizedPages: Object.values(organizedPages)
  };
} 