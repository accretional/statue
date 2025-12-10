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
      const { default: postinstall } = await import(postinstallPath);
      
      // Execute setup with the selected template
      if (typeof postinstall === 'function') {
        await postinstall({ template: templateName });
      } else {
        console.error(chalk.red('❌ Internal Error: postinstall script is not exporting a function.'));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Error initializing Statue SSG:'), error);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Sync routes from statue-ssg package (adds missing files without overwriting existing ones)')
  .option('-f, --force', 'Force overwrite existing files', false)
  .action(async (options) => {
    console.log(chalk.blue('🗿 Statue SSG - Syncing routes...'));

    const targetDir = process.cwd();
    const sourceRoutes = path.join(packageDir, 'src', 'routes');
    const targetRoutes = path.join(targetDir, 'src', 'routes');

    // Check if target routes exists
    if (!fs.existsSync(targetRoutes)) {
      console.error(chalk.red('❌ No src/routes folder found. Run "npx statue init" first.'));
      process.exit(1);
    }

    // Transform imports helper (same as postinstall.js)
    const transformImports = (code) => {
      code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/\1\.svelte['"];?/g, (m, name) => `import { ${name} } from 'statue-ssg';`);
      code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/([A-Za-z0-9_]+)\.svelte['"];?/g, (m, local, comp) => `import { ${comp} } from 'statue-ssg';`);
      code = code.replace(/from\s+['"]\$lib\/cms\/content-processor['"]/g, "from 'statue-ssg/cms/content-processor'");
      return code;
    };

    // Walk and transform files
    const transformFiles = (dir) => {
      const exts = new Set(['.svelte', '.js', '.ts']);
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          transformFiles(full);
        } else {
          const ext = path.extname(full);
          if (exts.has(ext)) {
            const orig = fs.readFileSync(full, 'utf8');
            const next = transformImports(orig);
            if (orig !== next) {
              fs.writeFileSync(full, next);
            }
          }
        }
      }
    };

    // Get all directories/files in source routes
    const syncedFiles = [];
    const skippedFiles = [];

    const syncDir = (srcDir, destDir, relativePath = '') => {
      if (!fs.existsSync(srcDir)) return;

      const entries = fs.readdirSync(srcDir);

      for (const entry of entries) {
        const srcPath = path.join(srcDir, entry);
        const destPath = path.join(destDir, entry);
        const relPath = path.join(relativePath, entry);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
          // If directory doesn't exist in target, copy entire directory
          if (!fs.existsSync(destPath)) {
            fs.copySync(srcPath, destPath);
            syncedFiles.push(relPath + '/');
            // Transform imports in newly copied directory
            transformFiles(destPath);
          } else {
            // Directory exists, recurse into it
            syncDir(srcPath, destPath, relPath);
          }
        } else {
          // It's a file
          if (!fs.existsSync(destPath)) {
            // File doesn't exist, copy it
            fs.copySync(srcPath, destPath);
            syncedFiles.push(relPath);
            // Transform imports if it's a code file
            const ext = path.extname(destPath);
            if (['.svelte', '.js', '.ts'].includes(ext)) {
              const orig = fs.readFileSync(destPath, 'utf8');
              const next = transformImports(orig);
              if (orig !== next) {
                fs.writeFileSync(destPath, next);
              }
            }
          } else if (options.force) {
            // Force overwrite
            fs.copySync(srcPath, destPath);
            syncedFiles.push(relPath + ' (overwritten)');
            const ext = path.extname(destPath);
            if (['.svelte', '.js', '.ts'].includes(ext)) {
              const orig = fs.readFileSync(destPath, 'utf8');
              const next = transformImports(orig);
              if (orig !== next) {
                fs.writeFileSync(destPath, next);
              }
            }
          } else {
            skippedFiles.push(relPath);
          }
        }
      }
    };

    try {
      syncDir(sourceRoutes, targetRoutes);

      if (syncedFiles.length > 0) {
        console.log(chalk.green('✓ Synced files:'));
        syncedFiles.forEach(f => console.log(chalk.green(`  + ${f}`)));
      } else {
        console.log(chalk.yellow('No new files to sync.'));
      }

      if (skippedFiles.length > 0 && !options.force) {
        console.log(chalk.gray(`\nSkipped ${skippedFiles.length} existing file(s). Use --force to overwrite.`));
      }

      console.log(chalk.green.bold('\n✨ Sync completed!'));

    } catch (error) {
      console.error(chalk.red('❌ Error syncing routes:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv); 
