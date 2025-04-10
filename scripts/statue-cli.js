#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDir = path.join(__dirname, '..');

const program = new Command();

program
  .name('statue')
  .description('Statue SSG - SvelteKit Static Site Generator for Markdown Content')
  .version('0.1.6');

program
  .command('init')
  .description('Initialize Statue SSG in your project')
  .action(async () => {
    console.log(chalk.blue('🗿 Statue SSG - Initializing your project'));
    
    try {
      // Run the postinstall script
      const postinstallPath = path.join(packageDir, 'postinstall.js');
      
      // Import the file dynamically
      const { default: postinstall } = await import(postinstallPath);
      
      // If postinstall is a function, execute it
      if (typeof postinstall === 'function') {
        await postinstall();
      } else {
        // Otherwise, just execute the script directly
        await import(postinstallPath);
      }
      
      console.log(chalk.green.bold('✅ Statue SSG successfully initialized!'));
    } catch (error) {
      console.error(chalk.red('❌ Error initializing Statue SSG:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv); 