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
  .description('Load a template into the workspace')
  .option('-f, --force', 'Force overwrite', false)
  .action(async (templateName, options) => {
    if (templateName === 'default') {
      console.log(chalk.yellow('Default template is already at root. Use git checkout to restore.'));
      return;
    }

    const templateDir = path.join(templatesDir, templateName);
    if (!fs.existsSync(templateDir)) {
      console.error(chalk.red(`❌ Template '${templateName}' not found`));
      return;
    }

    if (!options.force) {
      console.log(chalk.yellow('⚠️  This will overwrite src/ and site.config.json'));
      console.log(chalk.yellow('   Note: Core library (components, cms, themes) may be affected.'));
      console.log(chalk.red('Use -f or --force to proceed.'));
      return;
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}'...`));

    // Copy src (clear routes first to remove stale files)
    const sourceSrc = path.join(templateDir, 'src');
    if (fs.existsSync(sourceSrc)) {
      fs.emptyDirSync(path.join(rootDir, 'src/routes'));
      fs.copySync(sourceSrc, path.join(rootDir, 'src'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied src/'));
    }

    // Copy site.config.json
    const sourceConfig = path.join(templateDir, 'site.config.json');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(rootDir, 'site.config.json'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied site.config.json'));
    }

    console.log(chalk.green(`✅ Template '${templateName}' loaded!`));
    console.log(chalk.yellow('Run "npm run dev" to test.'));
  });

// SAVE: Workspace -> Template
program
  .command('save <templateName>')
  .description('Save current workspace routes into a template')
  .action(async (templateName) => {
    if (templateName === 'default') {
      console.log(chalk.yellow('Default template lives at root - commit changes with git.'));
      return;
    }

    const templateDir = path.join(templatesDir, templateName);
    fs.ensureDirSync(templateDir);

    console.log(chalk.blue(`💾 Saving template '${templateName}'...`));

    // Save src
    const sourceSrc = path.join(rootDir, 'src');
    if (fs.existsSync(sourceSrc)) {
      fs.copySync(sourceSrc, path.join(templateDir, 'src'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved src/'));
    }

    // Save site.config.json
    const sourceConfig = path.join(rootDir, 'site.config.json');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(templateDir, 'site.config.json'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved site.config.json'));
    }

    console.log(chalk.green(`✅ Template '${templateName}' saved!`));
  });

// LIST
program
  .command('list')
  .description('List available templates')
  .action(() => {
    console.log(chalk.blue('Available Templates:'));
    console.log(' - default (root)');

    if (fs.existsSync(templatesDir)) {
      const templates = fs.readdirSync(templatesDir)
        .filter(t => fs.statSync(path.join(templatesDir, t)).isDirectory());
      templates.forEach(t => console.log(` - ${t}`));
    }
  });

program.parse(process.argv);
