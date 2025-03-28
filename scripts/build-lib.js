// Script that builds the CMS module with Node.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildCMS } from '../src/lib/cms/index.js';

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Building static site from content folder...');

// Using Async IIFE to set up async/await structure
(async () => {
  try {
    // cleaning build folder
    const buildDir = path.join(rootDir, 'build');
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
    
    // Run CMS build process (now async)
    await buildCMS();
    console.log('Static site build completed successfully!');
  } catch (error) {
    console.error('Failed to build static site:', error);
    process.exit(1);
  }
})(); 