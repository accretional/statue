// This file is used to build the CMS pages during the build process
import { buildCMS } from './index.js';

console.log('Starting CMS build...');

try {
  buildCMS();
  console.log('CMS build completed successfully.');
} catch (error) {
  console.error('Failed to build CMS:', error);
  process.exit(1);
} 