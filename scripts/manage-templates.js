#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { Command } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.join(rootDir, 'templates');

const program = new Command();

program
  .name('template-manager')
  .description('Manage Statue SSG templates for development')
  .version('1.0.0');

// LOAD: Template -> Workspace
program
  .command('load <templateName>')
  .description('Load a template into the workspace (src/routes, content) for development')
  .option('-f, --force', 'Force overwrite of current workspace', false)
  .action(async (templateName, options) => {
    // Special handling for 'default'
    if (templateName === 'default') {
        console.log(chalk.yellow('⚠️  The "default" template lives in the project root (src/routes).'));
        console.log(chalk.yellow('   To restore the default template, please use git:'));
        console.log(chalk.white('   git checkout src/routes content site.config.js'));
        return;
    }

    const sourceTemplateDir = path.join(templatesDir, templateName);
    
    if (!fs.existsSync(sourceTemplateDir)) {
      console.error(chalk.red(`❌ Template '${templateName}' not found in ${templatesDir}`));
      return;
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}' into workspace...`));
    if (!options.force) {
        console.log(chalk.yellow('⚠️  Warning: This will overwrite your src/routes and content directories.'));
        console.log(chalk.yellow('   Ensure you have committed your changes to "default" (or other templates).'));
        console.error(chalk.red('Operation aborted. Use -f or --force to proceed.'));
        return;
    }

    // Targets in workspace
    const targetRoutes = path.join(rootDir, 'src/routes');
    const targetContent = path.join(rootDir, 'content');
    const targetConfig = path.join(rootDir, 'site.config.js');

    // 1. Clear current workspace
    console.log(chalk.gray('Cleaning current workspace...'));
    fs.emptyDirSync(targetRoutes);
    fs.emptyDirSync(targetContent);

    // 2. Copy from Template -> Workspace
    try {
        // Routes
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/routes'))) {
            fs.copySync(path.join(sourceTemplateDir, 'src/routes'), targetRoutes);
        }
        // Content
        if (fs.existsSync(path.join(sourceTemplateDir, 'content'))) {
            fs.copySync(path.join(sourceTemplateDir, 'content'), targetContent);
        }
        // Config
        if (fs.existsSync(path.join(sourceTemplateDir, 'site.config.js'))) {
            fs.copySync(path.join(sourceTemplateDir, 'site.config.js'), targetConfig);
        }
        
        console.log(chalk.green(`✅ Template '${templateName}' loaded successfully!`));
        console.log(chalk.yellow('Run "npm run dev" to test it.'));
    } catch (e) {
        console.error(chalk.red('Error loading template:'), e);
    }
  });

// SAVE: Workspace -> Template
program
  .command('save <templateName>')
  .description('Save current workspace (src/routes, content) into a template folder')
  .action(async (templateName) => {
    // Special handling for 'default'
    if (templateName === 'default') {
        console.log(chalk.green('✅  The "default" template is already in the project root.'));
        console.log(chalk.gray('   Just git commit your changes to save them.'));
        return;
    }

    const targetTemplateDir = path.join(templatesDir, templateName);
    
    console.log(chalk.blue(`💾 Saving workspace to template '${templateName}'...`));

    // Sources from workspace
    const sourceRoutes = path.join(rootDir, 'src/routes');
    const sourceContent = path.join(rootDir, 'content');
    const sourceConfig = path.join(rootDir, 'site.config.js');

    // 1. Ensure template dir exists
    fs.ensureDirSync(path.join(targetTemplateDir, 'src'));

    // 2. Copy Workspace -> Template
    try {
        // Routes
        if (fs.existsSync(sourceRoutes)) {
            fs.emptyDirSync(path.join(targetTemplateDir, 'src/routes'));
            fs.copySync(sourceRoutes, path.join(targetTemplateDir, 'src/routes'));
        }
        // Content
        if (fs.existsSync(sourceContent)) {
            fs.emptyDirSync(path.join(targetTemplateDir, 'content'));
            fs.copySync(sourceContent, path.join(targetTemplateDir, 'content'));
        }
        // Config
        if (fs.existsSync(sourceConfig)) {
            fs.copySync(sourceConfig, path.join(targetTemplateDir, 'site.config.js'));
        }
        
        console.log(chalk.green(`✅ Workspace saved to template '${templateName}'!`));
    } catch (e) {
        console.error(chalk.red('Error saving template:'), e);
    }
  });

// LIST
program
  .command('list')
  .description('List available templates')
  .action(() => {
    console.log(chalk.blue('Available Templates:'));
    console.log(' - default (Project Root)');
    
    if (fs.existsSync(templatesDir)) {
        const templates = fs.readdirSync(templatesDir).filter(t => fs.statSync(path.join(templatesDir, t)).isDirectory());
        templates.forEach(t => console.log(` - ${t}`));
    }
  });

program.parse(process.argv);
