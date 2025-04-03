import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import { generateStaticSite } from './index.js';
import { execSync } from 'child_process';

// __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CLI setup
const program = new Command();

program
  .name('statue-ssg')
  .description('Convert markdown content to a static website')
  .version('0.1.2');

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
  .command('setup')
  .description('Set up Statue SSG in your SvelteKit project')
  .action(() => {
    try {
      // Check if we're in a SvelteKit project
      const pkgPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(pkgPath)) {
        console.error(chalk.red('Error: No package.json found. Please run this command in a SvelteKit project.'));
        process.exit(1);
      }
      
      // Verify it's a SvelteKit project
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!pkg.dependencies?.['@sveltejs/kit'] && !pkg.devDependencies?.['@sveltejs/kit']) {
        console.warn(chalk.yellow('Warning: This doesn\'t appear to be a SvelteKit project.'));
      }
      
      console.log(chalk.green('Setting up Statue SSG in your project...'));
      
      // Find the postinstall.js script
      const postinstallPath = path.resolve(__dirname, '..', 'postinstall.js');
      if (fs.existsSync(postinstallPath)) {
        try {
          console.log(chalk.blue('Running setup script...'));
          // Run with Node.js (instead of require())
          execSync(`node "${postinstallPath}"`, { stdio: 'inherit' });
        } catch (err) {
          console.error(chalk.red('Error running setup script:'), err.message);
          console.log(chalk.yellow('For manual setup: node node_modules/statue-ssg/postinstall.js'));
          process.exit(1);
        }
      } else {
        console.error(chalk.red('Error: Setup script not found.'));
        console.log(chalk.yellow('Try running: node node_modules/statue-ssg/postinstall.js'));
        process.exit(1);
      }
    } catch (err) {
      console.error(chalk.red('Error during setup:'), err.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new Statue SSG project')
  .option('-d, --directory <n>', 'project directory name', '.')
  .option('-s, --sveltekit', 'initialize with SvelteKit integration')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.directory);
    
    try {
      if (options.sveltekit) {
        // Start with SvelteKit integration
        console.log(chalk.green('Initializing Statue SSG with SvelteKit integration...'));
        
        // Check folder structure first
        if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
          console.log(chalk.yellow('You are not in a SvelteKit project.'));
          console.log(chalk.blue('First create a SvelteKit project:'));
          console.log(chalk.white('npm create svelte@latest my-app'));
          console.log(chalk.white('cd my-app'));
          console.log(chalk.white('npm install'));
          console.log(chalk.white('npm install statue-ssg'));
          process.exit(0);
        }
        
        // Run postinstall.js command
        try {
          console.log(chalk.blue('Copying Statue SSG files...'));
          const postinstallPath = path.join(__dirname, '..', 'postinstall.js');
          
          if (fs.existsSync(postinstallPath)) {
            execSync(`node "${postinstallPath}"`, { stdio: 'inherit' });
          } else {
            console.error(chalk.red('postinstall.js file not found.'));
            console.log(chalk.yellow('Setting up manually...'));
            
            // Create directories manually
            fs.ensureDirSync(path.join(targetDir, 'content'));
            fs.ensureDirSync(path.join(targetDir, 'content/blog'));
            fs.ensureDirSync(path.join(targetDir, 'content/docs'));
            fs.ensureDirSync(path.join(targetDir, 'content/static'));
            
            console.log(chalk.green('✅ Content folders created.'));
          }
        } catch (err) {
          console.error(chalk.red('Error during integration:'), err.message);
        }
        
        console.log(chalk.green('✅ SvelteKit integration completed!'));
        console.log();
        console.log('Next steps:');
        console.log('  1. Install dependencies:', chalk.bold('npm install'));
        console.log('  2. Start development server:', chalk.bold('npm run dev'));
        console.log('  3. Edit content in the content/ directory');
      }
      else {
        // Start standalone Statue SSG
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
              'statue-ssg': '^0.1.2'
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
        console.log('  2. Build the static site:', chalk.bold('npm run build'));
        console.log('  3. Edit content in the content/ directory');
      }
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
