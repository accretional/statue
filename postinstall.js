#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Main setup function
async function setupStatueSSG() {
  // Get __dirname with ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // User's project directory (working directory)
  const targetDir = process.cwd();
  console.log(chalk.green('Copying Statue SSG files...'));
  console.log(chalk.blue(`Target directory: ${targetDir}`));

  // Source folders (files in this project)
  const sourceDir = __dirname;

  // Check if we're running in the same directory as the source
  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    console.log(chalk.yellow('⚠️  Running in the same directory as source, skipping file copy operations'));
    console.log(chalk.green.bold('✨ Statue SSG setup completed!'));
    return true;
  }

  // Target folders (directories in user's project)
  const targetSrc = path.join(targetDir, 'src');
  const targetRoutes = path.join(targetSrc, 'routes');
  const targetContent = path.join(targetDir, 'content');

  // Copy only src/routes folder and transform imports to use the package API
  try {
    const sourceRoutes = path.join(sourceDir, 'src', 'routes');
    if (!fs.existsSync(targetSrc)) fs.ensureDirSync(targetSrc);
    if (!fs.existsSync(targetRoutes)) fs.ensureDirSync(targetRoutes);

    // Copy routes first
    fs.copySync(sourceRoutes, targetRoutes, { overwrite: true, errorOnExist: false });
    console.log(chalk.green('✓ routes folder copied successfully'));

    // Helper: transform file imports in a string
    const transformImports = (code) => {
      // 1) Component default imports from $lib/components/X.svelte -> import { X } from 'statue-ssg'
      code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/\1\.svelte['"];?/g, (m, name) => `import { ${name} } from 'statue-ssg';`);

      // 2) Bulk replace any remaining $lib/components/<Any>.svelte -> named import
      code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/([A-Za-z0-9_]+)\.svelte['"];?/g, (m, local, comp) => `import { ${comp} } from 'statue-ssg';`);

      // 3) Replace stylesheet import - keep as $lib/index.css
      // No replacement needed - it stays as $lib/index.css

      // 4) Replace server cms imports
      code = code.replace(/from\s+['"]\$lib\/cms\/content-processor['"]/g, "from 'statue-ssg/cms/content-processor'");

      return code;
    };

    // Walk through all files in routes and transform svelte/js/ts files
    const exts = new Set(['.svelte', '.js', '.ts']);
    const walk = (dir) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full);
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

    walk(targetRoutes);
    console.log(chalk.green('✓ route imports transformed to use "statue-ssg"'));
  } catch (err) {
    console.error(chalk.red('An error occurred while copying routes or transforming imports:'), err);
  }

  // Copy content folder
  try {
    if (!fs.existsSync(targetContent)) {
      fs.ensureDirSync(targetContent);
      fs.copySync(
        path.join(sourceDir, 'content'), 
        targetContent, 
        { 
          overwrite: true,
          errorOnExist: false
        }
      );
      console.log(chalk.green('✓ content folder copied successfully'));
    } else {
      console.log(chalk.yellow('! content folder already exists, content not copied'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying content folder:'), err);
  }

  // Create src/lib/index.css with Tailwind imports (same as original project)
  try {
    const targetLib = path.join(targetSrc, 'lib');
    if (!fs.existsSync(targetLib)) fs.ensureDirSync(targetLib);
    
    const indexCssPath = path.join(targetLib, 'index.css');
    if (!fs.existsSync(indexCssPath)) {
      const appCssContent = `@import "tailwindcss";

/* Tailwind v4 content config - scans src directory for classes */
@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";

/* Theme selection - Import your desired theme */
@import "statue-ssg/themes/black-white.css";

/* Other theme options:
@import "statue-ssg/themes/red.css";
@import "statue-ssg/themes/orange.css";
@import "statue-ssg/themes/green.css";
@import "statue-ssg/themes/purple.css";
@import "statue-ssg/themes/cyan.css";
@import "statue-ssg/themes/pink.css";
*/

/* Base element defaults using tokens */
:root {
  color-scheme: dark;
}

/* Optional utilities for smooth rendering */
@layer utilities {
  .bg-surface { background-color: var(--color-card); }
  .glass-bg { background-color: color-mix(in srgb, var(--color-card) 78%, transparent); }
  .glass-border { border-color: color-mix(in srgb, var(--color-border) 70%, transparent); }
}`;
      fs.writeFileSync(indexCssPath, appCssContent);
      console.log(chalk.green('✓ src/lib/index.css created with Tailwind imports'));
    } else {
      console.log(chalk.yellow('! src/lib/index.css already exists, not overwritten'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while creating app.css:'), err);
  }

  // Copy root files (svelte.config.js, postcss.config.js etc.)
  // Note: tailwind.config.js is NOT copied because Tailwind v4 uses CSS-based config
  try {
    const rootFiles = ['svelte.config.js', 'vite.config.js', 'site.config.js', 'postcss.config.js'];
    
    rootFiles.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
        fs.copySync(sourcePath, targetPath);
        console.log(chalk.green(`✓ ${file} copied successfully`));
      } else if (fs.existsSync(targetPath)) {
        console.log(chalk.yellow(`! ${file} already exists, not overwritten`));
      }
    });
  } catch (err) {
    console.error(chalk.red('An error occurred while copying configuration files:'), err);
  }

  // Add required dependencies to package.json
  try {
    const targetPackageJsonPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(targetPackageJsonPath)) {
      // Read user's package.json file
      const packageJson = JSON.parse(fs.readFileSync(targetPackageJsonPath, 'utf8'));
      
      // Required dependencies
      const dependencies = {
        'marked': '^15.0.7',
        'gray-matter': '^4.0.3'
      };
      
      // Required devDependencies
      const devDependencies = {
        '@sveltejs/adapter-static': '^3.0.0',
        '@tailwindcss/postcss': '^4.1.14',
        'tailwindcss': '^4.0.0',
        '@types/node': '^22.13.13',
        'autoprefixer': '^10.4.21',
        'postcss': '^8.5.3'
      };
      
      // Add missing dependencies
      let dependenciesAdded = false;
      for (const [dep, version] of Object.entries(dependencies)) {
        if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
          packageJson.dependencies = packageJson.dependencies || {};
          packageJson.dependencies[dep] = version;
          dependenciesAdded = true;
        }
      }
      
      // Add missing devDependencies
      for (const [dep, version] of Object.entries(devDependencies)) {
        if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
          packageJson.devDependencies = packageJson.devDependencies || {};
          packageJson.devDependencies[dep] = version;
          dependenciesAdded = true;
        }
      }
      
      // Update package.json if changes were made
      if (dependenciesAdded) {
        fs.writeFileSync(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(chalk.green('✓ package.json updated, required dependencies added'));
        console.log(chalk.blue('Please run the following command now: npm install'));
      } else {
        console.log(chalk.green('✓ All required dependencies are already present'));
      }
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while updating package.json:'), err);
  }

  console.log(chalk.green.bold('✨ Statue SSG installation completed!'));
  console.log(chalk.blue('To get started with Statue-SSG for SvelteKit:'));
  console.log(chalk.white('1. If dependencies were added: npm install'));
  console.log(chalk.white('2. Start the development server: npm run dev'));
  console.log(chalk.white('3. Add your markdown content to the content/ folder'));
  console.log(chalk.white('4. Your content will be available through SvelteKit routes')); 
  
  return true;
}

// Auto-execute when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupStatueSSG().catch(err => {
    console.error(chalk.red('Setup failed with error:'), err);
    process.exit(1);
  });
}

export default setupStatueSSG; 