#!/usr/bin/env node

/**
 * This script builds the statue-ssg package for distribution as an npm package.
 * It compiles the main library components that will be used by consumers of the package.
 */

import { build } from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

// Ensure dist directory exists
fs.ensureDirSync(distDir);

// Copy the content-processor.js file and other necessary lib components
fs.ensureDirSync(path.resolve(distDir, 'lib'));
fs.ensureDirSync(path.resolve(distDir, 'lib/cms'));

// Copy source files
fs.copySync(
  path.resolve(srcDir, 'lib/cms/content-processor.js'),
  path.resolve(distDir, 'lib/cms/content-processor.js')
);

// Build the main package entry point
async function buildMain() {
  try {
    await build({
      entryPoints: [path.resolve(rootDir, 'src/index.js')],
      outfile: path.resolve(distDir, 'index.js'),
      bundle: true,
      platform: 'node',
      target: 'node16',
      format: 'esm',
      external: ['fs', 'path', 'marked', 'gray-matter', 'fs-extra', 'commander', 'chalk'],
    });
    
    console.log('✅ Built main package file');
  } catch (error) {
    console.error('Error building main package:', error);
    process.exit(1);
  }
}

// Create the main index.js file
async function createMainFile() {
  const indexContent = `
import { 
  scanContentDirectory,
  getContentDirectories,
  truncateContent,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories
} from './lib/cms/content-processor.js';

import { generateStaticSite } from './generator.js';

export {
  scanContentDirectory,
  getContentDirectories,
  truncateContent,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories,
  generateStaticSite
};
`;

  fs.writeFileSync(path.resolve(srcDir, 'index.js'), indexContent);
  console.log('✅ Created index.js');
}

// Create the generator module
async function createGeneratorModule() {
  const generatorContent = `
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { 
  getAllContent, 
  getContentDirectories 
} from './lib/cms/content-processor.js';

/**
 * Generates a static site from markdown content
 * @param {Object} options - Configuration options
 * @param {string} options.inputDir - Path to content directory
 * @param {string} options.outputDir - Path to output directory
 * @param {string} options.template - Path to custom template (optional)
 * @param {boolean} options.verbose - Enable verbose logging
 * @returns {Promise<void>}
 */
export async function generateStaticSite({
  inputDir = 'content',
  outputDir = 'build',
  template = null,
  verbose = false
} = {}) {
  try {
    console.log('📦 Starting to generate static site...');
    
    // Ensure input directory exists
    if (!fs.existsSync(inputDir)) {
      throw new Error(\`Input directory "\${inputDir}" not found\`);
    }

    // Clean output directory
    fs.ensureDirSync(outputDir);
    fs.emptyDirSync(outputDir);

    // If using a custom template, use it - otherwise use the default SvelteKit app
    const useCustomTemplate = template && fs.existsSync(template);
    
    if (verbose && useCustomTemplate) {
      console.log(\`🔧 Using custom template: \${template}\`);
    }
    
    // Process all content
    const allContent = getAllContent();
    const directories = getContentDirectories();
    
    if (verbose) {
      console.log(\`📄 Found \${allContent.length} content files\`);
      console.log(\`📁 Found \${directories.length} directories\`);
    }

    // Build routes
    for (const item of allContent) {
      const outputPath = path.join(outputDir, item.url);
      fs.ensureDirSync(path.dirname(outputPath));
      
      // Generate HTML for this item
      const html = generateHtmlForContent(item, allContent, directories);
      
      // Write HTML file
      fs.writeFileSync(\`\${outputPath}.html\`, html);
      
      if (verbose) {
        console.log(\`✅ Generated: \${item.url}.html\`);
      }
    }
    
    // Generate index.html
    const indexHtml = generateIndexHtml(directories, allContent);
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
    
    // Copy static assets if they exist
    const staticDir = path.join(inputDir, 'static');
    if (fs.existsSync(staticDir)) {
      fs.copySync(staticDir, path.join(outputDir, 'static'));
      console.log('📁 Copied static assets');
    }
    
    console.log(\`✨ Static site generated successfully in \${outputDir}\`);
  } catch (error) {
    console.error('❌ Error generating static site:', error);
    throw error;
  }
}

/**
 * Generates HTML for a content item
 */
function generateHtmlForContent(item, allContent, directories) {
  // Simple HTML template for content
  return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${item.metadata.title}</title>
  <meta name="description" content="\${item.metadata.description || ''}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 40px;
    }
    nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 20px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <header>
    <h1><a href="/">Statue SSG</a></h1>
    <nav>
      <ul>
        \${directories.map(dir => 
          \`<li><a href="\${dir.url}">\${dir.title}</a></li>\`
        ).join('')}
      </ul>
    </nav>
  </header>
  <main>
    <h1>\${item.metadata.title}</h1>
    \${item.metadata.date 
      ? \`<p>Published on: \${new Date(item.metadata.date).toLocaleDateString()}</p>\` 
      : ''}
    \${item.metadata.author 
      ? \`<p>Author: \${item.metadata.author}</p>\` 
      : ''}
    <div class="content">
      \${item.content}
    </div>
  </main>
  <footer>
    <p>Generated with <a href="https://github.com/your-username/statue-ssg">Statue SSG</a></p>
  </footer>
</body>
</html>\`;
}

/**
 * Generates index.html for the home page
 */
function generateIndexHtml(directories, allContent) {
  // Get root content
  const rootContent = allContent.filter(entry => entry.directory === '');

  return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statue SSG</title>
  <meta name="description" content="A simple static site generator for markdown content">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 40px;
    }
    nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 20px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .card {
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <header>
    <h1><a href="/">Statue SSG</a></h1>
    <nav>
      <ul>
        \${directories.map(dir => 
          \`<li><a href="\${dir.url}">\${dir.title}</a></li>\`
        ).join('')}
      </ul>
    </nav>
  </header>
  <main>
    <h1>Welcome to Statue SSG</h1>
    <p>A simple static site generator for markdown content with SvelteKit</p>
    
    <h2>Content Categories</h2>
    <div class="grid">
      \${directories.map(dir => \`
        <div class="card">
          <h3>\${dir.title}</h3>
          <a href="\${dir.url}">View Content</a>
        </div>
      \`).join('')}
    </div>
    
    \${rootContent.length > 0 ? \`
      <h2>Latest Content</h2>
      <div class="grid">
        \${rootContent.map(page => \`
          <div class="card">
            <h3>\${page.metadata.title}</h3>
            \${page.metadata.description ? \`<p>\${page.metadata.description}</p>\` : ''}
            <a href="\${page.url}.html">Read more</a>
          </div>
        \`).join('')}
      </div>
    \` : ''}
  </main>
  <footer>
    <p>Generated with <a href="https://github.com/your-username/statue-ssg">Statue SSG</a></p>
  </footer>
</body>
</html>\`;
}
`;

  fs.writeFileSync(path.resolve(srcDir, 'generator.js'), generatorContent);
  console.log('✅ Created generator.js');
}

// Run the build process
async function run() {
  try {
    await createMainFile();
    await createGeneratorModule();
    await buildMain();
    
    console.log('✅ Package build completed successfully!');
  } catch (error) {
    console.error('❌ Error building package:', error);
    process.exit(1);
  }
}

run(); 