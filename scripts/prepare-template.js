#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create template directory
const templateDir = path.join(rootDir, 'template');
fs.ensureDirSync(templateDir);

console.log(chalk.green('✨ Preparing template folder...'));

// Define source files and target paths
const filesToCopy = [
  { src: 'src', dest: 'src' },
  { src: 'content', dest: 'content' },
  { src: 'svelte.config.js', dest: 'svelte.config.js' },
  { src: 'vite.config.js', dest: 'vite.config.js' },
  { src: 'tailwind.config.js', dest: 'tailwind.config.js' },
];

// Copy files
for (const file of filesToCopy) {
  const srcPath = path.join(rootDir, file.src);
  const destPath = path.join(templateDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    try {
      // If target already exists, clean it first
      if (fs.existsSync(destPath)) {
        fs.removeSync(destPath);
      }
      
      // Copy folder or file
      fs.copySync(srcPath, destPath);
      console.log(chalk.green(`✓ ${file.src} copied`));
    } catch (err) {
      console.error(chalk.red(`✗ Error while copying ${file.src}: ${err.message}`));
    }
  } else {
    console.warn(chalk.yellow(`! ${file.src} not found, skipping`));
  }
}

// Template for creating package.json
const templatePackageJson = {
  "name": "statue-example",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "svelte": "^4.2.7",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "marked": "^15.0.0"
  },
  "type": "module"
};

// Write package.json file into template
fs.writeFileSync(
  path.join(templateDir, 'package.json'), 
  JSON.stringify(templatePackageJson, null, 2)
);
console.log(chalk.green('✓ template/package.json created'));

// README create
const readmeContent = `# Statue SSG Template

This folder contains files that will be copied to the user's project when the statue-ssg npm package is installed or when the \`statue-ssg init -s\` command is run.

## Contents

- \`/src\`: SvelteKit source files
- \`/content\`: Markdown content files
- Configuration files (svelte.config.js, vite.config.js, tailwind.config.js)
`;

fs.writeFileSync(path.join(templateDir, 'README.md'), readmeContent);
console.log(chalk.green('✓ template/README.md created'));

console.log(chalk.green.bold('✅ Template folder prepared!')); 