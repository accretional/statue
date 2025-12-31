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
const resourcesDir = path.join(rootDir, 'resources');

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

      // Backup static/
      if (fs.existsSync(path.join(rootDir, 'static'))) {
        fs.copySync(path.join(rootDir, 'static'), path.join(backupDir, 'static'));
        console.log(chalk.gray('  ✓ Backed up static/'));
      }

      console.log(chalk.green(`  → Backup saved to _backup/`));
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}'...`));

    // Core files that should NEVER be overwritten (only index.ts for exports)
    const coreFiles = [
      'src/lib/index.ts'
    ];

    // Backup core files before copying
    const coreBackups = new Map();
    for (const coreFile of coreFiles) {
      const fullPath = path.join(rootDir, coreFile);
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          coreBackups.set(coreFile, { isDir: true, content: fs.readdirSync(fullPath) });
        } else {
          coreBackups.set(coreFile, { isDir: false, content: fs.readFileSync(fullPath) });
        }
      }
    }

    // Copy src/routes (clear and replace)
    const sourceRoutes = path.join(templateDir, 'src', 'routes');
    if (fs.existsSync(sourceRoutes)) {
      fs.emptyDirSync(path.join(rootDir, 'src/routes'));
      fs.copySync(sourceRoutes, path.join(rootDir, 'src/routes'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied src/routes/'));
    }

    // Copy src/lib/components (merge - add template components)
    const sourceComponents = path.join(templateDir, 'src', 'lib', 'components');
    if (fs.existsSync(sourceComponents)) {
      fs.copySync(sourceComponents, path.join(rootDir, 'src/lib/components'), { overwrite: true });
      console.log(chalk.gray('  ✓ Merged src/lib/components/'));
    }

    // Copy src/lib/*.css and other template-specific lib files (except index.ts)
    const sourceLib = path.join(templateDir, 'src', 'lib');
    if (fs.existsSync(sourceLib)) {
      const libFiles = fs.readdirSync(sourceLib);
      for (const file of libFiles) {
        const srcPath = path.join(sourceLib, file);
        const stat = fs.statSync(srcPath);
        // Copy files (not directories, except components which we already handled)
        // Skip index.ts as it will be restored
        if (!stat.isDirectory() && file !== 'index.ts') {
          fs.copySync(srcPath, path.join(rootDir, 'src/lib', file), { overwrite: true });
          console.log(chalk.gray(`  ✓ Copied src/lib/${file}`));
        }
      }
    }

    // Restore core files that might have been overwritten
    for (const [coreFile, backup] of coreBackups) {
      const fullPath = path.join(rootDir, coreFile);
      if (!backup.isDir) {
        fs.writeFileSync(fullPath, backup.content);
      }
    }
    console.log(chalk.gray('  ✓ Preserved core library files'));

    // Copy site.config.js
    const sourceConfig = path.join(templateDir, 'site.config.js');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(rootDir, 'site.config.js'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied site.config.js'));
    }

    // Copy static/ from resources/<template>/static/
    const sourceStatic = path.join(resourcesDir, templateName, 'static');
    if (fs.existsSync(sourceStatic)) {
      fs.copySync(sourceStatic, path.join(rootDir, 'static'), { overwrite: true });
      console.log(chalk.gray('  ✓ Copied static/ from resources/'));
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

    // Save src/routes
    const sourceRoutes = path.join(rootDir, 'src/routes');
    if (fs.existsSync(sourceRoutes)) {
      fs.ensureDirSync(path.join(templateDir, 'src'));
      fs.emptyDirSync(path.join(templateDir, 'src/routes'));
      fs.copySync(sourceRoutes, path.join(templateDir, 'src/routes'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved src/routes/'));
    }

    // Save src/lib/components (template-specific components)
    const sourceComponents = path.join(rootDir, 'src/lib/components');
    if (fs.existsSync(sourceComponents)) {
      fs.ensureDirSync(path.join(templateDir, 'src/lib'));
      fs.copySync(sourceComponents, path.join(templateDir, 'src/lib/components'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved src/lib/components/'));
    }

    // Save src/lib files (css, etc.) but NOT index.ts (that's core)
    const sourceLib = path.join(rootDir, 'src/lib');
    if (fs.existsSync(sourceLib)) {
      const libFiles = fs.readdirSync(sourceLib);
      for (const file of libFiles) {
        const srcPath = path.join(sourceLib, file);
        const stat = fs.statSync(srcPath);
        // Copy files (not directories like components, cms, themes)
        // Skip index.ts as it's core
        if (!stat.isDirectory() && file !== 'index.ts') {
          fs.copySync(srcPath, path.join(templateDir, 'src/lib', file), { overwrite: true });
          console.log(chalk.gray(`  ✓ Saved src/lib/${file}`));
        }
      }
    }

    // Create minimal src/lib/index.ts placeholder (so template structure is valid)
    const placeholderIndex = '// place files you want to import through the `$lib` alias in this folder.\n';
    fs.ensureDirSync(path.join(templateDir, 'src/lib'));
    fs.writeFileSync(path.join(templateDir, 'src/lib/index.ts'), placeholderIndex);
    console.log(chalk.gray('  ✓ Created src/lib/index.ts placeholder'));

    // Save site.config.js
    const sourceConfig = path.join(rootDir, 'site.config.js');
    if (fs.existsSync(sourceConfig)) {
      fs.copySync(sourceConfig, path.join(templateDir, 'site.config.js'), { overwrite: true });
      console.log(chalk.gray('  ✓ Saved site.config.js'));
    }

    // Save static/ to resources/<template>/static/
    const sourceStatic = path.join(rootDir, 'static');
    const targetStatic = path.join(resourcesDir, templateName, 'static');
    if (fs.existsSync(sourceStatic)) {
      fs.ensureDirSync(path.join(resourcesDir, templateName));
      fs.copySync(sourceStatic, targetStatic, { overwrite: true });
      console.log(chalk.gray('  ✓ Saved static/ to resources/'));
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

    // Restore static/
    const backupStatic = path.join(backupDir, 'static');
    if (fs.existsSync(backupStatic)) {
      fs.copySync(backupStatic, path.join(rootDir, 'static'), { overwrite: true });
      console.log(chalk.gray('  ✓ Restored static/'));
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
