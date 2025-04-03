#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import { generateStaticSite } from './index.js';

// Handle __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up CLI
const program = new Command();

program
  .name('statue-ssg')
  .description('Convert markdown content to a static website')
  .version('0.0.1');

program
  .command('build')
  .description('Build a static site from markdown content')
  .option('-i, --input <directory>', 'input content directory', 'content')
  .option('-o, --output <directory>', 'output directory', 'build')
  .option('-t, --template <path>', 'custom template directory')
  .option('-v, --verbose', 'verbose output')
  .action(async (options) => {
    console.log(chalk.bold.green('Statue SSG - Static Site Generator'));
    
    try {
      await generateStaticSite({
        inputDir: options.input,
        outputDir: options.output,
        template: options.template,
        verbose: options.verbose
      });
      
      console.log(chalk.green('✨ Static site generated successfully!'));
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new Statue SSG project')
  .option('-d, --directory <name>', 'project directory name', '.')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.directory);
    
    try {
      // Create directory structure
      fs.ensureDirSync(targetDir);
      fs.ensureDirSync(path.join(targetDir, 'content'));
      fs.ensureDirSync(path.join(targetDir, 'content/blog'));
      fs.ensureDirSync(path.join(targetDir, 'content/docs'));
      fs.ensureDirSync(path.join(targetDir, 'content/static'));
      
      // Create example content
      const exampleContent = `---
title: Hello World
description: Welcome to Statue SSG
date: ${new Date().toISOString().split('T')[0]}
---

# Welcome to Statue SSG

This is an example markdown file.

## Features

- Simple markdown content
- Fast static site generation
- SEO friendly

`;
      
      fs.writeFileSync(path.join(targetDir, 'content/blog/hello-world.md'), exampleContent);
      
      // Create package.json if it doesn't exist
      const pkgPath = path.join(targetDir, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        const pkg = {
          name: path.basename(targetDir),
          version: '0.0.1',
          description: 'A static site built with Statue SSG',
          type: 'module',
          scripts: {
            build: 'statue-ssg build',
            dev: 'statue-ssg build && serve build'
          },
          dependencies: {
            'statue-ssg': '^0.0.1'
          },
          devDependencies: {
            serve: '^14.0.0'
          }
        };
        
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }
      
      console.log(chalk.green('✅ Statue SSG project initialized!'));
      console.log();
      console.log('Next steps:');
      console.log('  1. Install dependencies:', chalk.bold('npm install'));
      console.log('  2. Build the site:', chalk.bold('npm run build'));
      console.log('  3. Edit content in the', chalk.bold('content/'), 'directory');
      
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
