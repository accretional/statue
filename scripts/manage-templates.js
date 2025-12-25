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
const defaultTemplateDir = path.join(templatesDir, '_default');

const program = new Command();

program
  .name('template-manager')
  .description('Manage Statue SSG templates for development')
  .version('1.0.0');

// Helper: Get template-specific dependencies from package.json
// Excludes statue-ssg core dependencies
function getTemplatePackageJson(packageJsonPath) {
    if (!fs.existsSync(packageJsonPath)) return null;

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Core dependencies that should NOT be saved with template
    const coreDeps = new Set([
        'statue-ssg', 'marked', 'gray-matter', 'chalk', 'commander', 'fs-extra'
    ]);
    const coreDevDeps = new Set([
        '@sveltejs/adapter-static', '@sveltejs/kit', '@sveltejs/vite-plugin-svelte',
        '@tailwindcss/postcss', '@testing-library/jest-dom', '@testing-library/svelte',
        '@types/node', '@typescript-eslint/parser', '@vitest/browser-playwright',
        'autoprefixer', 'esbuild', 'eslint', 'eslint-plugin-svelte', 'jsdom',
        'pagefind', 'playwright', 'postcss', 'prettier', 'prettier-plugin-svelte',
        'rimraf', 'svelte', 'svelte-sitemap', 'tailwindcss', 'typescript', 'vite',
        'vitest', 'vitest-browser-svelte'
    ]);

    const templatePkg = {};

    // Filter dependencies
    if (pkg.dependencies) {
        const deps = {};
        for (const [name, version] of Object.entries(pkg.dependencies)) {
            if (!coreDeps.has(name)) deps[name] = version;
        }
        if (Object.keys(deps).length > 0) templatePkg.dependencies = deps;
    }

    // Filter devDependencies
    if (pkg.devDependencies) {
        const devDeps = {};
        for (const [name, version] of Object.entries(pkg.devDependencies)) {
            if (!coreDevDeps.has(name)) devDeps[name] = version;
        }
        if (Object.keys(devDeps).length > 0) templatePkg.devDependencies = devDeps;
    }

    return Object.keys(templatePkg).length > 0 ? templatePkg : null;
}

// Helper: Merge template dependencies into target package.json
function mergeTemplatePackageJson(targetPkgPath, templatePkg) {
    if (!templatePkg || !fs.existsSync(targetPkgPath)) return false;

    const pkg = JSON.parse(fs.readFileSync(targetPkgPath, 'utf8'));
    let changed = false;

    if (templatePkg.dependencies) {
        pkg.dependencies = pkg.dependencies || {};
        for (const [name, version] of Object.entries(templatePkg.dependencies)) {
            if (!pkg.dependencies[name]) {
                pkg.dependencies[name] = version;
                changed = true;
            }
        }
    }

    if (templatePkg.devDependencies) {
        pkg.devDependencies = pkg.devDependencies || {};
        for (const [name, version] of Object.entries(templatePkg.devDependencies)) {
            if (!pkg.devDependencies[name]) {
                pkg.devDependencies[name] = version;
                changed = true;
            }
        }
    }

    if (changed) {
        fs.writeFileSync(targetPkgPath, JSON.stringify(pkg, null, 2));
    }

    return changed;
}

// LOAD: Template -> Workspace
program
  .command('load <templateName>')
  .description('Load a template into the workspace (src, static, content, package.json) for development')
  .option('-f, --force', 'Force overwrite of current workspace', false)
  .action(async (templateName, options) => {
    // Determine source template directory
    let sourceTemplateDir;
    const isDefault = templateName === 'default';

    if (isDefault) {
        sourceTemplateDir = defaultTemplateDir;
        if (!fs.existsSync(sourceTemplateDir)) {
            console.error(chalk.red(`❌ Default template backup not found at ${sourceTemplateDir}`));
            console.log(chalk.yellow('   Run "npm run template:save default" first to create the backup.'));
            console.log(chalk.yellow('   Or use git: git checkout src content static site.config.js'));
            return;
        }
    } else {
        sourceTemplateDir = path.join(templatesDir, templateName);
        if (!fs.existsSync(sourceTemplateDir)) {
            console.error(chalk.red(`❌ Template '${templateName}' not found in ${templatesDir}`));
            return;
        }
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}' into workspace...`));
    if (!options.force) {
        console.log(chalk.yellow('⚠️  Warning: This will overwrite:'));
        console.log(chalk.yellow('   - src/ (entire folder)'));
        console.log(chalk.yellow('   - static/'));
        console.log(chalk.yellow('   - content/'));
        console.log(chalk.yellow('   - site.config.js'));
        console.log(chalk.yellow('   - package.json (template dependencies will be merged)'));
        console.log(chalk.yellow('   Ensure you have committed your changes.'));
        console.error(chalk.red('Operation aborted. Use -f or --force to proceed.'));
        return;
    }

    // Targets in workspace
    const targetSrc = path.join(rootDir, 'src');
    const targetStatic = path.join(rootDir, 'static');
    const targetContent = path.join(rootDir, 'content');
    const targetConfig = path.join(rootDir, 'site.config.js');
    const targetPackageJson = path.join(rootDir, 'package.json');

    try {
        // 1. Copy src folder (entire folder, preserving lib/components, lib/themes, etc.)
        if (fs.existsSync(path.join(sourceTemplateDir, 'src'))) {
            // Keep core lib files that shouldn't be replaced
            const coreLibFiles = ['cms', 'index.ts', 'index.css'];
            const srcLib = path.join(targetSrc, 'lib');

            // Backup core lib items
            const backups = {};
            for (const item of coreLibFiles) {
                const itemPath = path.join(srcLib, item);
                if (fs.existsSync(itemPath)) {
                    backups[item] = fs.readFileSync !== undefined && fs.statSync(itemPath).isFile()
                        ? fs.readFileSync(itemPath)
                        : null;
                }
            }

            // Clear and copy src
            fs.emptyDirSync(path.join(targetSrc, 'routes'));
            fs.copySync(path.join(sourceTemplateDir, 'src'), targetSrc, { overwrite: true });
            console.log(chalk.gray('  ✓ Copied src/'));
        }

        // 2. Copy static folder
        if (fs.existsSync(path.join(sourceTemplateDir, 'static'))) {
            fs.emptyDirSync(targetStatic);
            fs.copySync(path.join(sourceTemplateDir, 'static'), targetStatic);
            console.log(chalk.gray('  ✓ Copied static/'));
        }

        // 3. Copy content folder
        if (fs.existsSync(path.join(sourceTemplateDir, 'content'))) {
            fs.emptyDirSync(targetContent);
            fs.copySync(path.join(sourceTemplateDir, 'content'), targetContent);
            console.log(chalk.gray('  ✓ Copied content/'));
        }

        // 4. Copy site.config.js
        if (fs.existsSync(path.join(sourceTemplateDir, 'site.config.js'))) {
            fs.copySync(path.join(sourceTemplateDir, 'site.config.js'), targetConfig);
            console.log(chalk.gray('  ✓ Copied site.config.js'));
        }

        // 5. Merge template package.json dependencies
        const templatePkgPath = path.join(sourceTemplateDir, 'package.json');
        if (fs.existsSync(templatePkgPath)) {
            const templatePkg = JSON.parse(fs.readFileSync(templatePkgPath, 'utf8'));
            if (mergeTemplatePackageJson(targetPackageJson, templatePkg)) {
                console.log(chalk.gray('  ✓ Merged template dependencies into package.json'));
                console.log(chalk.blue('   Run "npm install" to install new dependencies.'));
            }
        }

        console.log(chalk.green(`✅ Template '${templateName}' loaded successfully!`));
        console.log(chalk.yellow('Run "npm install && npm run dev" to test it.'));
    } catch (e) {
        console.error(chalk.red('Error loading template:'), e);
    }
  });

// SAVE: Workspace -> Template
program
  .command('save <templateName>')
  .description('Save current workspace (src, static, content, package.json) into a template folder')
  .action(async (templateName) => {
    // For 'default', save to _default folder as backup
    const targetTemplateDir = templateName === 'default'
        ? defaultTemplateDir
        : path.join(templatesDir, templateName);

    console.log(chalk.blue(`💾 Saving workspace to template '${templateName}'...`));

    // Sources from workspace
    const sourceSrc = path.join(rootDir, 'src');
    const sourceStatic = path.join(rootDir, 'static');
    const sourceContent = path.join(rootDir, 'content');
    const sourceConfig = path.join(rootDir, 'site.config.js');
    const sourcePackageJson = path.join(rootDir, 'package.json');

    // Ensure template dir exists
    fs.ensureDirSync(targetTemplateDir);

    try {
        // 1. Copy entire src folder
        if (fs.existsSync(sourceSrc)) {
            const targetSrc = path.join(targetTemplateDir, 'src');
            if (fs.existsSync(targetSrc)) {
                fs.emptyDirSync(targetSrc);
            }
            fs.copySync(sourceSrc, targetSrc);
            console.log(chalk.gray('  ✓ Saved src/'));
        }

        // 2. Copy static folder
        if (fs.existsSync(sourceStatic)) {
            const targetStatic = path.join(targetTemplateDir, 'static');
            if (fs.existsSync(targetStatic)) {
                fs.emptyDirSync(targetStatic);
            }
            fs.copySync(sourceStatic, targetStatic);
            console.log(chalk.gray('  ✓ Saved static/'));
        }

        // 3. Copy content folder
        if (fs.existsSync(sourceContent)) {
            const targetContent = path.join(targetTemplateDir, 'content');
            if (fs.existsSync(targetContent)) {
                fs.emptyDirSync(targetContent);
            }
            fs.copySync(sourceContent, targetContent);
            console.log(chalk.gray('  ✓ Saved content/'));
        }

        // 4. Copy site.config.js
        if (fs.existsSync(sourceConfig)) {
            fs.copySync(sourceConfig, path.join(targetTemplateDir, 'site.config.js'));
            console.log(chalk.gray('  ✓ Saved site.config.js'));
        }

        // 5. Save template-specific dependencies from package.json
        const templatePkg = getTemplatePackageJson(sourcePackageJson);
        if (templatePkg) {
            fs.writeFileSync(
                path.join(targetTemplateDir, 'package.json'),
                JSON.stringify(templatePkg, null, 2)
            );
            console.log(chalk.gray('  ✓ Saved package.json (template dependencies only)'));
        }

        console.log(chalk.green(`✅ Workspace saved to template '${templateName}'!`));
        if (templateName === 'default') {
            console.log(chalk.gray('   Default template backed up to templates/_default/'));
        }
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
