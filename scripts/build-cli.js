#!/usr/bin/env node

/**
 * This script builds the CLI executable for the statue-ssg package.
 */

import { build } from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

// Check if dist directory exists
fs.ensureDirSync(distDir);

// Build CLI file
async function buildCli() {
  console.log('Building CLI...');
  
  try {
    // Bundle src/cli.js and its dependencies into a single file
    await build({
      entryPoints: [path.join(srcDir, 'cli.js')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node16',
      outfile: path.join(distDir, 'cli.js'),
      minify: false,
      // Keep Node.js modules external, to be resolved at runtime
      external: [
        'chalk', 
        'commander', 
        'fs', 
        'fs-extra', 
        'path', 
        'url', 
        'child_process',
        'gray-matter',
        'marked',
        'node:*',  // Node.js core modules
        'util',
        'os'
      ],
      banner: {
        js: '// statue-ssg CLI\n// Generated by esbuild\n',
      },
      // Package options
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });
    console.log('✅ CLI built successfully!');
  } catch (error) {
    console.error('❌ Error building CLI:', error);
    process.exit(1);
  }
}

async function run() {
  // Build CLI file
  await buildCli();
  
  console.log('Statue SSG CLI built successfully.');
}

run();