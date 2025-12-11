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
  .command('sync-routes')
  .description('Force sync core route folders ([...slug] and [directory]) from statue-ssg package')
  .action(async () => {
    console.log(chalk.blue('🗿 Statue SSG - Syncing core routes...'));

    const targetDir = process.cwd();
    const sourceRoutes = path.join(packageDir, 'src', 'routes');
    const targetRoutes = path.join(targetDir, 'src', 'routes');

    // Only these folders will be synced (force overwrite)
    const routeFolders = ['[...slug]', '[directory]'];

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

    // Walk and transform files in a directory
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

    try {
      const syncedFolders = [];

      for (const folder of routeFolders) {
        const srcPath = path.join(sourceRoutes, folder);
        const destPath = path.join(targetRoutes, folder);

        // Check if source folder exists
        if (!fs.existsSync(srcPath)) {
          console.log(chalk.yellow(`⚠ Source folder not found: ${folder}`));
          continue;
        }

        // Remove existing folder if it exists
        if (fs.existsSync(destPath)) {
          fs.removeSync(destPath);
          console.log(chalk.gray(`  Removed existing: ${folder}/`));
        }

        // Copy folder from source
        fs.copySync(srcPath, destPath);

        // Transform imports
        transformFiles(destPath);

        syncedFolders.push(folder);
        console.log(chalk.green(`  ✓ Synced: ${folder}/`));
      }

      if (syncedFolders.length > 0) {
        console.log(chalk.green.bold(`\n✨ Successfully synced ${syncedFolders.length} route folder(s)!`));
      } else {
        console.log(chalk.yellow('\nNo folders were synced.'));
      }

    } catch (error) {
      console.error(chalk.red('❌ Error syncing routes:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv); 
