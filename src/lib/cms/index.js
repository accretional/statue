import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

export function loadConfig() {
  const configPath = path.resolve('src/_pagegroups/config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('CMS config file not found at ' + configPath);
  }
  
  const configData = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configData);
  
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

export function generatePageGroupPages(pageGroup, outputBaseDir) {
  const outputDir = path.join(outputBaseDir, pageGroup.outputDir);
  
  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Generate a page for each content file
  pageGroup.pages.forEach(page => {
    const pageOutputDir = path.join(outputDir, path.dirname(page.path));
    fs.mkdirSync(pageOutputDir, { recursive: true });
    
    const pagePath = path.join(pageOutputDir, path.basename(page.path, '.md'));
    fs.mkdirSync(pagePath, { recursive: true });
    
    // Create +page.svelte
    const pageContent = `
<script>
  import Wrapper from '$lib/cms/Wrapper.svelte';
  
  const metadata = ${JSON.stringify(page.metadata)};
  const content = ${JSON.stringify(page.content)};
</script>

<Wrapper 
  title="${page.metadata.title || ''}"
  content={content}
  metadata={metadata}
/>
`;
    fs.writeFileSync(path.join(pagePath, '+page.svelte'), pageContent);
    
    // Create +page.js
    const pageJs = `
export const prerender = true;
export const ssr = true;
`;
    fs.writeFileSync(path.join(pagePath, '+page.js'), pageJs);
  });
  
  // Generate a list page
  if (pageGroup.listable) {
    const listPageDir = path.join(outputDir);
    fs.mkdirSync(listPageDir, { recursive: true });
    
    // Create +page.svelte
    const listPageContent = `
<script>
  import PageGroup from '$lib/cms/PageGroup.svelte';
  
  const pages = ${JSON.stringify(pageGroup.pages.map(p => ({
    title: p.metadata.title,
    description: p.metadata.description,
    date: p.metadata.date,
    path: p.path,
    slug: p.slug,
    url: p.url
  })))};
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">${pageGroup.title}</h1>
  
  <PageGroup 
    pages={pages} 
    hierarchical={${pageGroup.hierarchical ? 'true' : 'false'}} 
  />
</div>
`;
    fs.writeFileSync(path.join(listPageDir, '+page.svelte'), listPageContent);
    
    // Create +page.js
    const listPageJs = `
export const prerender = true;
export const ssr = true;
`;
    fs.writeFileSync(path.join(listPageDir, '+page.js'), listPageJs);
  }
}

export function buildCMS() {
  const config = loadConfig();
  
  // Process all page groups
  config.pageGroups.forEach(pageGroup => {
    processPageGroup(pageGroup);
    generatePageGroupPages(pageGroup, 'src/routes');
  });
  
  console.log('CMS build completed successfully.');
} 