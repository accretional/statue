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
  .option('--no-backup', 'Skip backup of current workspace')
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
      console.log(chalk.yellow('⚠️  This will overwrite src/ and site.config.js'));
      console.log(chalk.yellow('   Note: Core library (components, cms, themes) may be affected.'));
      console.log(chalk.red('Use -f or --force to proceed.'));
      return;
    }

    // Backup current workspace before loading
    const backupDir = path.join(rootDir, '_backup');
    if (options.backup) {
      console.log(chalk.blue('📦 Backing up current workspace...'));
      fs.emptyDirSync(backupDir);

      // Backup src/
      if (fs.existsSync(path.join(rootDir, 'src'))) {
        fs.copySync(path.join(rootDir, 'src'), path.join(backupDir, 'src'));
        console.log(chalk.gray('  ✓ Backed up src/'));
      }

      // Backup site.config.js
      if (fs.existsSync(path.join(rootDir, 'site.config.js'))) {
        fs.copySync(path.join(rootDir, 'site.config.js'), path.join(backupDir, 'site.config.js'));
        console.log(chalk.gray('  ✓ Backed up site.config.js'));
      }

      console.log(chalk.green(`  → Backup saved to _backup/`));
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}'...`));

    // Copy src (clear routes first to remove stale files)
    const sourceSrc = path.join(templateDir, 'src');
    if (fs.existsSync(sourceSrc)) {
      fs.emptyDirSync(path.join(rootDir, 'src/routes'));
      fs.copySync(sourceSrc, path.join(rootDir, 'src'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied src/'));
    }

    // Copy site.config.js
    const sourceConfig = path.join(templateDir, 'site.config.js');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(rootDir, 'site.config.js'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied site.config.js'));
    }

    console.log(chalk.green(`✅ Template '${templateName}' loaded!`));
    console.log(chalk.yellow('Run "npm run dev" to test.'));
    if (options.backup) {
      console.log(chalk.gray('💡 Restore backup with: npm run template:restore'));
    }
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

    // Save site.config.js
    const sourceConfig = path.join(rootDir, 'site.config.js');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(templateDir, 'site.config.js'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved site.config.js'));
    }

    console.log(chalk.green(`✅ Template '${templateName}' saved!`));
  });

// RESTORE: _backup -> Workspace
program
  .command('restore')
  .description('Restore workspace from _backup')
  .action(async () => {
    const backupDir = path.join(rootDir, '_backup');

    if (!fs.existsSync(backupDir)) {
      console.error(chalk.red('❌ No backup found. Run template:load first.'));
      return;
    }

    console.log(chalk.blue('🔄 Restoring from backup...'));

    // Restore src/
    const backupSrc = path.join(backupDir, 'src');
    if (fs.existsSync(backupSrc)) {
      fs.emptyDirSync(path.join(rootDir, 'src/routes'));
      fs.copySync(backupSrc, path.join(rootDir, 'src'), { overwrite: true });
      console.log(chalk.gray('  ✓ Restored src/'));
    }

    // Restore site.config.js
    const backupConfig = path.join(backupDir, 'site.config.js');
    if (fs.existsSync(backupConfig)) {
      fs.copySync(backupConfig, path.join(rootDir, 'site.config.js'), { overwrite: true });
      console.log(chalk.gray('  ✓ Restored site.config.js'));
    }

    console.log(chalk.green('✅ Workspace restored from backup!'));
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
