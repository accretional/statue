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
  console.log(chalk.blue(`🗿 Statue SSG - Initializing...`));
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
    const baseRoutes = path.join(sourceDir, 'src/routes');
    const templateRoutes = path.join(templateDir, 'src/routes');
    
    if (!fs.existsSync(targetSrc)) fs.ensureDirSync(targetSrc);
    if (!fs.existsSync(targetRoutes)) fs.ensureDirSync(targetRoutes);

    // 1a. Always install and transform base routes first
    if (fs.existsSync(baseRoutes)) {
        fs.copySync(baseRoutes, targetRoutes, { overwrite: true });
        
        // Helper: transform file imports in a string
        const transformImports = (code) => {
          code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/\1\.svelte['"];?/g, (m, name) => `import { ${name} } from 'statue-ssg';`);
          code = code.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\$lib\/components\/([A-Za-z0-9_]+)\.svelte['"];?/g, (m, local, comp) => `import { ${comp} } from 'statue-ssg';`);
          code = code.replace(/from\s+['"]\$lib\/cms\/content-processor['"]/g, "from 'statue-ssg/cms/content-processor'");
          return code;
        };

        const exts = new Set(['.svelte', '.js', '.ts']);
        const walk = (dir) => {
          const entries = fs.readdirSync(dir);
          for (const entry of entries) {
            const full = path.join(dir, entry);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) walk(full);
            else if (exts.has(path.extname(full))) {
              const orig = fs.readFileSync(full, 'utf8');
              const next = transformImports(orig);
              if (orig !== next) fs.writeFileSync(full, next);
            }
          }
        };
        walk(targetRoutes);
        console.log(chalk.green('✓ base routes installed and transformed'));
    }

    // 1b. Overlay custom template routes (no transformation)
    if (!isDefaultTemplate && fs.existsSync(templateRoutes)) {
        fs.copySync(templateRoutes, targetRoutes, { overwrite: true });
        console.log(chalk.green(`✓ template routes overlaid from ${templateName}`));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying routes or transforming imports:'), err);
  }

  // 2. Copy Content from Template
  try {
    const baseContent = path.join(sourceDir, 'content');
    const templateContent = path.join(templateDir, 'content');
    
    // Always ensure target content exists
    if (!fs.existsSync(targetContent)) fs.ensureDirSync(targetContent);

    // 2a. Copy base content if target is empty
    if (fs.existsSync(baseContent) && fs.readdirSync(targetContent).length === 0) {
        fs.copySync(baseContent, targetContent, { overwrite: true });
        console.log(chalk.green('✓ base content installed'));
    }

    // 2b. Overlay template content
    if (!isDefaultTemplate && fs.existsSync(templateContent)) {
        fs.copySync(templateContent, targetContent, { overwrite: true });
        console.log(chalk.green(`✓ template content overlaid from ${templateName}`));
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

    // 3.1 Overlay src/lib from template (for custom components, themes, etc)
    if (!isDefaultTemplate && fs.existsSync(path.join(templateDir, 'src/lib'))) {
        fs.copySync(path.join(templateDir, 'src/lib'), targetLib, { overwrite: true });
        console.log(chalk.green(`✓ src/lib folder content copied from ${templateName}`));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while creating app.css:'), err);
  }


  // 3.5. Copy src/app.html (required for favicon and meta tags)
  try {
    const templateAppHtml = path.join(templateDir, 'src/app.html');
    const rootAppHtml = path.join(sourceDir, 'src/app.html');
    const targetAppHtml = path.join(targetSrc, 'app.html');

    let sourcePath = null;
    if (fs.existsSync(templateAppHtml)) {
      sourcePath = templateAppHtml;
    } else if (fs.existsSync(rootAppHtml)) {
      sourcePath = rootAppHtml;
    }

    if (sourcePath) {
      fs.copySync(sourcePath, targetAppHtml, { overwrite: true });
      console.log(chalk.green('✓ src/app.html copied successfully'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying app.html:'), err);
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

      if (sourcePath) {
        // Force overwrite for config files to ensure correct setup
        fs.copySync(sourcePath, targetPath, { overwrite: true });
        console.log(chalk.green(`✓ ${file} copied/updated successfully`));
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
        'postcss': '^8.5.3',
        'pagefind': '^1.1.1'
      };

      // Scripts required by the framework
      const requiredScripts = {
        'postbuild': 'node scripts/generate-seo-files.js && node scripts/run-pagefind.js',
        'preview': 'npx -y serve build'
      };

      // Scripts that should always be overwritten (even if they exist)
      const scriptsToOverwrite = new Set(['preview', 'postbuild']);

      let dependenciesAdded = false;
      let templateDependenciesAdded = false;
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

      if (!isDefaultTemplate) {
        const templatePackageJsonPath = path.join(templateDir, 'package.json');
        if (fs.existsSync(templatePackageJsonPath)) {
          const templatePkg = JSON.parse(fs.readFileSync(templatePackageJsonPath, 'utf8'));
          if (templatePkg.dependencies) {
            packageJson.dependencies = packageJson.dependencies || {};
            for (const [dep, version] of Object.entries(templatePkg.dependencies)) {
              if (!packageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = version;
                templateDependenciesAdded = true;
              }
            }
          }
          if (templatePkg.devDependencies) {
            packageJson.devDependencies = packageJson.devDependencies || {};
            for (const [dep, version] of Object.entries(templatePkg.devDependencies)) {
              if (!packageJson.devDependencies[dep]) {
                packageJson.devDependencies[dep] = version;
                templateDependenciesAdded = true;
              }
            }
          }
        }
      }

      let scriptsAdded = false;
      packageJson.scripts = packageJson.scripts || {};
      for (const [scriptName, scriptCommand] of Object.entries(requiredScripts)) {
        const shouldOverwrite = scriptsToOverwrite.has(scriptName);
        const scriptExists = packageJson.scripts[scriptName];
        const scriptMatches = scriptExists && packageJson.scripts[scriptName] === scriptCommand;

        if (!scriptExists || (shouldOverwrite && !scriptMatches)) {
          packageJson.scripts[scriptName] = scriptCommand;
          scriptsAdded = true;
        }
      }

      if (dependenciesAdded || templateDependenciesAdded || scriptsAdded) {
        fs.writeFileSync(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
        if (dependenciesAdded) {
          console.log(chalk.green('✓ package.json updated with required dependencies'));
        }
        if (templateDependenciesAdded) {
          console.log(chalk.green('✓ package.json updated with template dependencies'));
        }
        if (scriptsAdded) {
          console.log(chalk.green('✓ package.json updated with required scripts'));
        }
        console.log(chalk.blue('Please run: npm install'));
      }
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while updating package.json:'), err);
  }

  // 6. Copy Scripts (required for postbuild)
  try {
    const targetScripts = path.join(targetDir, 'scripts');
    if (!fs.existsSync(targetScripts)) fs.ensureDirSync(targetScripts);

    const sourceScripts = path.join(sourceDir, 'scripts');
    const requiredScripts = ['generate-seo-files.js', 'run-pagefind.js'];

    if (fs.existsSync(sourceScripts)) {
      requiredScripts.forEach(scriptFile => {
        const sourceScriptPath = path.join(sourceScripts, scriptFile);
        const targetScriptPath = path.join(targetScripts, scriptFile);

        if (fs.existsSync(sourceScriptPath)) {
          fs.copySync(sourceScriptPath, targetScriptPath, { overwrite: true });
        }
      });
      console.log(chalk.green('✓ required scripts copied successfully'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying scripts:'), err);
  }

  // 7. Copy Static Assets (entire static folder)
  try {
    const targetStatic = path.join(targetDir, 'static');
    if (!fs.existsSync(targetStatic)) fs.ensureDirSync(targetStatic);

    // templateDir could be the same as sourceDir (default template)
    const templateStaticPath = path.join(templateDir, 'static');
    const rootStaticPath = path.join(sourceDir, 'static');

    let sourcePath = null;

    // 1. Try template specific static folder
    if (fs.existsSync(templateStaticPath)) {
      sourcePath = templateStaticPath;
    }
    // 2. Fallback to root static folder if not found in template
    else if (fs.existsSync(rootStaticPath)) {
      sourcePath = rootStaticPath;
    }

    if (sourcePath) {
      // Copy all static files, preserving structure
      fs.copySync(sourcePath, targetStatic, { overwrite: true, errorOnExist: false });
      console.log(chalk.green('✓ static folder copied successfully'));
    }
  } catch (err) {
    console.error(chalk.red('An error occurred while copying static assets:'), err);
  }

  // 8. Auto Install Dependencies
  // We'll only run this if NOT running as part of a package install lifecycle to avoid loops
  if (!process.env.npm_lifecycle_event || process.env.npm_lifecycle_event === 'init') {
    const { execSync } = await import('child_process');
    console.log(chalk.blue('📦 Installing dependencies...'));
    try {
      execSync('npm install', { stdio: 'inherit', cwd: targetDir });
      console.log(chalk.green('✓ Dependencies installed'));
    } catch (e) {
      console.error(chalk.yellow('! Failed to install dependencies automatically. Please run "npm install".'));
    }
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
