#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath, pathToFileURL } from 'url';
import chalk from 'chalk';

// Get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDir = path.join(__dirname, '..');

const program = new Command();

program
  .name('statue')
  .description('Statue SSG - SvelteKit Static Site Generator for Markdown Content')
  .version('0.2.0');

program
  .command('init')
  .description('Initialize Statue SSG in your project')
  .option('-t, --template <name>', 'Specify a template to use (default: "default")', 'default')
  .action(async (options) => {
    const templateName = options.template;
    console.log(chalk.blue(`🗿 Statue SSG - Initializing with template: ${chalk.bold(templateName)}`));
    
    try {
      // Check if template exists before proceeding
      // 'default' always exists (it's the package root)
      if (templateName !== 'default') {
        const templatePath = path.join(packageDir, 'templates', templateName);
        if (!fs.existsSync(templatePath)) {
          console.error(chalk.red(`❌ Template '${templateName}' does not exist.`));
          console.log(chalk.yellow('Available templates:'));
          console.log('  - default');
          try {
            const templates = fs.readdirSync(path.join(packageDir, 'templates'))
              .filter(t => fs.statSync(path.join(packageDir, 'templates', t)).isDirectory());
            templates.forEach(t => console.log(`  - ${t}`));
          } catch (e) {
             // Ignore
          }
          process.exit(1);
        }
      }

      // Run the postinstall script with options
      const postinstallPath = path.join(packageDir, 'postinstall.js');
      const { default: postinstall } = await import(pathToFileURL(postinstallPath).href);
      
      // Execute setup with the selected template
      if (typeof postinstall === 'function') {
        await postinstall({ template: templateName });
      } else {
        console.error(chalk.red('❌ Internal Error: postinstall script is not exporting a function.'));
        process.exit(1);
      }

      // Run template's post-setup script if exists (doesn't get copied to user project)
      if (templateName !== 'default') {
        const postSetupPath = path.join(packageDir, 'templates', templateName, 'post-setup.sh');
        if (fs.existsSync(postSetupPath)) {
          console.log(chalk.blue('\n📦 Running template setup wizard...'));

          const { execSync } = await import('child_process');
          try {
            execSync(`bash "${postSetupPath}"`, {
              cwd: process.cwd(),
              stdio: 'inherit',
              env: { ...process.env, PROJECT_DIR: process.cwd() }
            });
          } catch (setupError) {
            console.log(chalk.yellow('⚠ Post-setup script failed, but installation completed.'));
            console.log(chalk.gray('  You can run it manually later.'));
          }
        }
      }

    } catch (error) {
      console.error(chalk.red('❌ Error initializing Statue SSG:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv); 
