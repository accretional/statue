// This file is used to build the CMS pages during the build process
import { buildCMS } from './index.js';

console.log('Starting CMS build from content folder...');

try {
  buildCMS();
  console.log('CMS build completed successfully. Static site is ready in the build folder.');
} catch (error) {
  console.error('Failed to build CMS:', error);
  process.exit(1);
} 