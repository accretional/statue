import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
// ... existing code ...

// Import modules needed to compile Svelte components
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';

// Automatically detects all subdirectories in the content folder and returns them
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

export function loadConfig() {
  const configPath = path.resolve('src/_pagegroups/config.json');
  let config = {
    pageGroups: []
  };
  
  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch (error) {
      console.warn(`Warning: Could not parse config file: ${error.message}`);
    }
  } else {
    console.log('Config file not found, using auto-detected content directories');
  }
  
  // If config file doesn't exist or pageGroups is not defined, automatically detect directories
  if (!config.pageGroups || config.pageGroups.length === 0) {
    const detectedDirs = detectContentDirectories();
    config.pageGroups = detectedDirs.map(dir => ({
      name: dir.name,
      title: dir.title,
      sourceDir: dir.path,
      format: 'markdown',
      outputDir: dir.outputDir,
      listable: true,
      hierarchical: dir.name === 'docs' // Hierarchical view active for Docs
    }));
  }
  
  // Initialize empty pages array for each page group
  config.pageGroups.forEach((group) => {
    group.pages = [];
  });
  
  return config;
}

export function processMarkdown(content) {
  const result = marked.parse(content);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}

export function processPageGroup(pageGroup) {
  const sourceDir = path.resolve(pageGroup.sourceDir);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Source directory ${sourceDir} for page group ${pageGroup.name} does not exist.`);
    return;
  }
  
  const files = getAllFiles(sourceDir);
  
  files.forEach(file => {
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
  });
}

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

// Basic template processing function
function renderTemplate(templatePath, data) {
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  // Simple handlebars-like variable replacement
  template = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    key = key.trim();
    
    // Conditional expression check
    if (key.startsWith('if ')) {
      // This basic template engine doesn't support conditions,
      // so we return the real value directly
      return '';
    }
    
    // For each loop - simple implementation
    if (key.startsWith('each ')) {
      return '';
    }
    
    // Clean up #if, #each closing tags
    if (key.startsWith('/if') || key.startsWith('/each')) {
      return '';
    }
    
    // formatDate helper
    if (key.startsWith('formatDate ')) {
      const datePath = key.replace('formatDate ', '');
      const dateValue = getNestedValue(data, datePath);
      if (dateValue) {
        return new Date(dateValue).toLocaleDateString();
      }
      return '';
    }
    
    // formatTitle helper
    if (key.startsWith('formatTitle ')) {
      const slug = key.replace('formatTitle ', '');
      if (data[slug]) {
        return formatTitle(data[slug]);
      }
      return formatTitle(slug);
    }
    
    // For year
    if (key === 'currentYear') {
      return new Date().getFullYear().toString();
    }
    
    // For nested values
    return getNestedValue(data, key) || '';
  });
  
  // Process conditional blocks
  template = processConditionalBlocks(template, data);
  
  // Process each blocks
  template = processEachBlocks(template, data);
  
  return template;
}

// Helper function to get nested values
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return '';
    }
    result = result[key];
  }
  
  return result !== undefined ? result : '';
}

// Processing conditional blocks
function processConditionalBlocks(template, data) {
  const ifRegex = /\{\{#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  return template.replace(ifRegex, (match, condition, content) => {
    condition = condition.trim();
    const value = getNestedValue(data, condition);
    
    if (value) {
      return processConditionalBlocks(content, data); // Process nested ifs recursively
    }
    return '';
  });
}

// Processing each blocks
function processEachBlocks(template, data) {
  const eachRegex = /\{\{#each ([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return template.replace(eachRegex, (match, arrayPath, itemTemplate) => {
    const array = getNestedValue(data, arrayPath);
    
    if (!Array.isArray(array)) {
      return '';
    }
    
    // Process template for each item and combine results
    return array.map(item => {
      // Add support for "this" usage
      const itemData = { ...data, this: item };
      let result = itemTemplate;
      
      // Process basic variables for the item
      result = result.replace(/\{\{([^}]+)\}\}/g, (m, key) => {
        key = key.trim();
        
        // Skip conditional and each expressions here
        if (key.startsWith('if ') || key.startsWith('/if') || 
            key.startsWith('each ') || key.startsWith('/each')) {
          return m;
        }
        
        // Access to item properties
        if (key.includes('.')) {
          return getNestedValue(itemData, key) || '';
        }
        
        return item[key] !== undefined ? item[key] : '';
      });
      
      // Process nested conditional and each blocks
      result = processConditionalBlocks(result, item);
      result = processEachBlocks(result, item);
      
      return result;
    }).join('');
  });
}

// Helper function to create title format from slug
function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Writing static HTML files directly to the build folder
export async function generateStaticPages(pageGroup, outputBaseDir) {
  const outputDir = path.join(outputBaseDir, pageGroup.outputDir);
  
  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Create a temporary file for all pages
  const tempDir = path.resolve('.tmp', 'pages', pageGroup.name);
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Create a page for each content file
  for (const page of pageGroup.pages) {
    const pageOutputDir = path.join(outputDir, path.dirname(page.path));
    fs.mkdirSync(pageOutputDir, { recursive: true });
    
    // Create folder for the page (for clean URLs)
    const pagePath = path.join(pageOutputDir, path.basename(page.path, '.md'));
    fs.mkdirSync(pagePath, { recursive: true });
    
    // Create the page data
    const pageData = {
      title: page.metadata.title || formatTitle(page.slug),
      content: page.content,
      date: page.metadata.date,
      author: page.metadata.author,
      backLink: pageGroup.listable ? `/${pageGroup.outputDir}` : null,
      backLinkText: pageGroup.title,
      activePath: page.url,
      currentYear: new Date().getFullYear(),
      // Add all page groups for navbar
      navbarItems: generateNavbarItems(outputBaseDir)
    };
    
    try {
      // Create Svelte entry file
      const entryContent = `
        import ContentPage from '../../../src/lib/components/ContentPage.svelte';
        
        new ContentPage({
          target: document.body,
          props: ${JSON.stringify(pageData)}
        });
      `;
      
      const entryPath = path.join(tempDir, `${page.slug}.js`);
      fs.writeFileSync(entryPath, entryContent);
      
      // Compile Svelte component with Vite
      await build({
        root: process.cwd(),
        publicDir: false,
        build: {
          outDir: path.join(outputBaseDir, 'assets', 'pages', pageGroup.name),
          emptyOutDir: false,
          rollupOptions: {
            input: entryPath,
            output: {
              entryFileNames: `${page.slug}.js`,
              chunkFileNames: 'chunks/[name]-[hash].js',
              assetFileNames: 'css/[name]-[hash].[ext]'
            }
          }
        },
        plugins: [svelte()]
      });
      
      // Create HTML content
      const pageHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageData.title}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script type="module" src="/assets/pages/${pageGroup.name}/${page.slug}.js" defer></script>
        </head>
        <body>
          <!-- Svelte component will be mounted here -->
        </body>
        </html>
      `;
      
      fs.writeFileSync(path.join(pagePath, 'index.html'), pageHtml);
    } catch (error) {
      console.error(`Failed to build Svelte component for page ${page.slug}:`, error);
      
      // Use old template in case of error
      console.log(`Falling back to template-based page generation for ${page.slug}...`);
      const templatePath = path.resolve('src/lib/templates/page.html');
      const pageContent = renderTemplate(templatePath, pageData);
      fs.writeFileSync(path.join(pagePath, 'index.html'), pageContent);
    }
  }
  
  // If listable is true, create an index page
  if (pageGroup.listable || pageGroup.pages.length === 0) {
    // Create index page even if there are no md files in the folder
    await createIndexPage(pageGroup, outputDir, outputBaseDir);
  }
}

// Create menu items for navbar
function generateNavbarItems(outputBaseDir) {
  // Detect all directories in the content folder
  const contentDirs = detectContentDirectories();
  
  return contentDirs.map(dir => ({
    title: dir.title,
    url: `/${dir.outputDir}`
  }));
}

// Create index page for folder
async function createIndexPage(pageGroup, outputDir, outputBaseDir) {
  // Prepare data for list page
  const organizedPages = {};
  
  if (pageGroup.hierarchical) {
    // Organize pages for hierarchical view
    pageGroup.pages.forEach(page => {
      const pathParts = page.path.split('/');
      // Remove last part (file name)
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
  
  const listData = {
    title: pageGroup.title,
    hierarchical: pageGroup.hierarchical,
    organizedPages: Object.values(organizedPages),
    pages: pageGroup.pages.map(p => ({
      title: p.metadata.title || formatTitle(p.slug),
      url: p.url,
      description: p.metadata.description,
      date: p.metadata.date
    })),
    currentYear: new Date().getFullYear(),
    activePath: `/${pageGroup.outputDir}`,
    // Add all page groups for navbar
    navbarItems: generateNavbarItems(outputBaseDir)
  };
  
  try {
    // Create temporary file for Svelte component
    const tempDir = path.resolve('.tmp', 'indexes');
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Create Svelte entry file
    const entryContent = `
      import ContentList from '../../../src/lib/components/ContentList.svelte';
      
      new ContentList({
        target: document.body,
        props: ${JSON.stringify(listData)}
      });
    `;
    
    const entryPath = path.join(tempDir, `${pageGroup.name}-index.js`);
    fs.writeFileSync(entryPath, entryContent);
    
    // Compile Svelte component with Vite
    await build({
      root: process.cwd(),
      publicDir: false,
      build: {
        outDir: path.join(outputBaseDir, 'assets', 'indexes'),
        emptyOutDir: false,
        rollupOptions: {
          input: entryPath,
          output: {
            entryFileNames: `${pageGroup.name}-index.js`,
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'css/[name]-[hash].[ext]'
          }
        }
      },
      plugins: [svelte()]
    });
    
    // Create HTML content
    const listHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${listData.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script type="module" src="/assets/indexes/${pageGroup.name}-index.js" defer></script>
      </head>
      <body>
        <!-- Svelte component will be mounted here -->
      </body>
      </html>
    `;
    
    fs.writeFileSync(path.join(outputDir, 'index.html'), listHtml);
  } catch (error) {
    console.error(`Failed to build Svelte component for index page of ${pageGroup.name}:`, error);
    
    // Use old template in case of error
    console.log(`Falling back to template-based index page generation for ${pageGroup.name}...`);
    const templatePath = path.resolve('src/lib/templates/list.html');
    const listPageContent = renderTemplate(templatePath, listData);
    fs.writeFileSync(path.join(outputDir, 'index.html'), listPageContent);
  }
}

// Homepage creation
async function generateHomepage(config, outputBaseDir) {
  // Old template-based approach
  const templatePath = path.resolve('src/lib/templates/home.html');
  
  const homeData = {
    pageGroups: config.pageGroups,
    currentYear: new Date().getFullYear(),
    // Add all page groups for navbar
    navbarItems: generateNavbarItems(outputBaseDir)
  };
  
  // Create temporary file for Svelte component
  const tempDir = path.resolve('.tmp');
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Create Svelte entry point file
  const entryContent = `
    import HomePage from '../src/lib/components/HomePage.svelte';
    
    new HomePage({
      target: document.body,
      props: ${JSON.stringify(homeData)}
    });
  `;
  
  const entryPath = path.join(tempDir, 'main.js');
  fs.writeFileSync(entryPath, entryContent);
  
  // Compile Svelte component
  try {
    await build({
      root: process.cwd(),
      publicDir: 'static',
      build: {
        outDir: path.join(outputBaseDir, 'assets'),
        emptyOutDir: false,
        rollupOptions: {
          input: entryPath,
          output: {
            entryFileNames: 'js/home-bundle.js',
            chunkFileNames: 'js/[name]-[hash].js',
            assetFileNames: 'css/[name]-[hash].[ext]'
          }
        }
      },
      plugins: [svelte()]
    });
    
    // Create HTML content - required for Svelte component
    const homeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Statue SSG</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script type="module" src="/assets/js/home-bundle.js" defer></script>
      </head>
      <body>
        <!-- Svelte component will be mounted here -->
      </body>
      </html>
    `;
    
    fs.writeFileSync(path.join(outputBaseDir, 'index.html'), homeHtml);
    console.log('Homepage with Svelte components built successfully.');
  } catch (error) {
    console.error('Failed to build Svelte components:', error);
    
    // Use old template in case of error
    console.log('Falling back to template-based homepage generation...');
    const homeContent = renderTemplate(templatePath, homeData);
    fs.writeFileSync(path.join(outputBaseDir, 'index.html'), homeContent);
  }
}

// Make buildCMS function async
export async function buildCMS() {
  const config = loadConfig();
  const outputDir = 'build';
  
  // Clean and recreate build directory
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Copy static files
  if (fs.existsSync('static')) {
    copyDirectorySync('static', outputDir);
  }
  
  // Process all page groups
  config.pageGroups.forEach(pageGroup => {
    processPageGroup(pageGroup);
    generateStaticPages(pageGroup, outputDir);
  });
  
  // Create homepage (now async)
  await generateHomepage(config, outputDir);
  
  console.log('CMS build completed successfully.');
}

// Helper function for directory copying
function copyDirectorySync(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectorySync(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
} 