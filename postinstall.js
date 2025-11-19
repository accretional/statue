#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Main setup function
async function setupStatueSSG(options = {}) {
  // Default options
  const templateName = options.template || 'default';

  // Get __dirname with ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // User's project directory (working directory)
  const targetDir = process.cwd();
  console.log(chalk.blue(`🗿 Statue SSG - Initializing '${templateName}' template...`));
  console.log(chalk.gray(`Target directory: ${targetDir}`));

  // Source folders (files in this project)
  const sourceDir = __dirname;
  
  // Determine Template Directory
  let templateDir;
  let isDefaultTemplate = false;

  if (templateName === 'default') {
    // Default template lives in the package root
    templateDir = sourceDir;
    isDefaultTemplate = true;
  } else {
    // Other templates live in templates/ directory
    templateDir = path.join(sourceDir, 'templates', templateName);
    
    if (!fs.existsSync(templateDir)) {
        console.error(chalk.red(`❌ Template '${templateName}' not found.`));
        console.log(chalk.yellow('Available templates:'));
        console.log('  - default');
        try {
        const availableTemplates = fs.readdirSync(path.join(sourceDir, 'templates'))
            .filter(file => fs.statSync(path.join(sourceDir, 'templates', file)).isDirectory());
        availableTemplates.forEach(t => console.log(`  - ${t}`));
        } catch (e) {
        // Templates folder might not exist yet
        }
        throw new Error(`Template ${templateName} not found`);
    }
  }

  // Check if we're running in the same directory as the source (Dev mode check)
  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    console.log(chalk.yellow('⚠️  Running in source directory. Use "npm run template:load" to switch templates for development.'));
    return true;
  }

  // Target folders (directories in user's project)
  const targetSrc = path.join(targetDir, 'src');
  const targetRoutes = path.join(targetSrc, 'routes');
  const targetContent = path.join(targetDir, 'content');

  // 1. Copy Routes from Template
  try {
    const sourceRoutes = path.join(templateDir, 'src/routes');
    if (!fs.existsSync(targetSrc)) fs.ensureDirSync(targetSrc);
    if (!fs.existsSync(targetRoutes)) fs.ensureDirSync(targetRoutes);

    if (fs.existsSync(sourceRoutes)) {
        // Copy routes
        fs.copySync(sourceRoutes, targetRoutes, { overwrite: true, errorOnExist: false });
        console.log(chalk.green(`✓ routes folder copied from ${isDefaultTemplate ? 'default (root)' : templateName}`));

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
    } else {
        console.warn(chalk.yellow(`! Template '${templateName}' does not have a src/routes directory.`));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying routes or transforming imports:'), err);
  }

  // 2. Copy Content from Template
  try {
    const sourceContent = path.join(templateDir, 'content');
    
    if (fs.existsSync(sourceContent)) {
        if (!fs.existsSync(targetContent)) {
            fs.ensureDirSync(targetContent);
            fs.copySync(sourceContent, targetContent, { overwrite: true, errorOnExist: false });
            console.log(chalk.green(`✓ content folder copied from ${isDefaultTemplate ? 'default (root)' : templateName}`));
        } else {
            console.log(chalk.yellow('! content folder already exists, content not copied'));
        }
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying content folder:'), err);
  }

  // 3. Create src/lib/index.css (Core Logic - Standard for all templates)
  try {
    const targetLib = path.join(targetSrc, 'lib');
    if (!fs.existsSync(targetLib)) fs.ensureDirSync(targetLib);
    
    const indexCssPath = path.join(targetLib, 'index.css');
    if (!fs.existsSync(indexCssPath)) {
      const appCssContent = `@import "tailwindcss";

/* Theme selection - Default for new projects */
@import "statue-ssg/themes/black-white.css";

/* Tailwind v4 content config */
@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";

:root {
  color-scheme: dark;
}

@layer utilities {
  .bg-surface { background-color: var(--color-card); }
  .glass-bg { background-color: color-mix(in srgb, var(--color-card) 78%, transparent); }
  .glass-border { border-color: color-mix(in srgb, var(--color-border) 70%, transparent); }
}`;
      fs.writeFileSync(indexCssPath, appCssContent);
      console.log(chalk.green('✓ src/lib/index.css created'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while creating app.css:'), err);
  }

  // 4. Copy Root Configuration Files from Template (or fallback to source root)
  try {
    const configFiles = ['site.config.js', 'svelte.config.js', 'vite.config.js', 'postcss.config.js'];
    
    configFiles.forEach(file => {
      const templateConfigPath = path.join(templateDir, file);
      const rootConfigPath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      // Determine source
      // If default, templateDir IS sourceDir, so just check once
      let sourcePath = null;
      
      if (fs.existsSync(templateConfigPath)) {
          sourcePath = templateConfigPath;
      } else if (!isDefaultTemplate && fs.existsSync(rootConfigPath)) {
          // Fallback to root config if custom template doesn't have one
          sourcePath = rootConfigPath;
      }

      if (sourcePath && !fs.existsSync(targetPath)) {
        fs.copySync(sourcePath, targetPath);
        console.log(chalk.green(`✓ ${file} copied successfully`));
      } else if (fs.existsSync(targetPath)) {
        console.log(chalk.yellow(`! ${file} already exists, not overwritten`));
      }
    });
  } catch (err) {
    console.error(chalk.red('An error occurred while copying configuration files:'), err);
  }

  // 5. Update Package.json (Shared Logic)
  try {
    const targetPackageJsonPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(targetPackageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(targetPackageJsonPath, 'utf8'));
      
      // Dependencies required by the framework
      const dependencies = {
        'marked': '^15.0.7',
        'gray-matter': '^4.0.3'
      };
      
      const devDependencies = {
        '@sveltejs/adapter-static': '^3.0.0',
        '@tailwindcss/postcss': '^4.1.14',
        'tailwindcss': '^4.0.0',
        '@types/node': '^22.13.13',
        'autoprefixer': '^10.4.21',
        'postcss': '^8.5.3'
      };
      
      let dependenciesAdded = false;
      for (const [dep, version] of Object.entries(dependencies)) {
        if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
          packageJson.dependencies = packageJson.dependencies || {};
          packageJson.dependencies[dep] = version;
          dependenciesAdded = true;
        }
      }
      
      for (const [dep, version] of Object.entries(devDependencies)) {
        if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
          packageJson.devDependencies = packageJson.devDependencies || {};
          packageJson.devDependencies[dep] = version;
          dependenciesAdded = true;
        }
      }
      
      if (dependenciesAdded) {
        fs.writeFileSync(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(chalk.green('✓ package.json updated with required dependencies'));
        console.log(chalk.blue('Please run: npm install'));
      }
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while updating package.json:'), err);
  }

  console.log(chalk.green.bold('✨ Statue SSG setup completed!'));
  
  return true;
}

// Auto-execute when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  let template = 'default';
  
  const templateIndex = args.indexOf('--template');
  if (templateIndex !== -1 && args[templateIndex + 1]) {
    template = args[templateIndex + 1];
  }

  setupStatueSSG({ template }).catch(err => {
    console.error(chalk.red('Setup failed with error:'), err);
    process.exit(1);
  });
}

export default setupStatueSSG;
