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

// ============================================================
// DIFF HELPERS - Compare files/folders against default
// ============================================================

// Get all files recursively from a directory
function getAllFiles(dir, baseDir = dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(baseDir, fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            files.push(relativePath);
        }
    }
    return files;
}

// Check if two files have the same content
function filesAreEqual(file1, file2) {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) return false;

    const stat1 = fs.statSync(file1);
    const stat2 = fs.statSync(file2);

    // Different sizes = different files
    if (stat1.size !== stat2.size) return false;

    // Compare content
    const content1 = fs.readFileSync(file1);
    const content2 = fs.readFileSync(file2);
    return content1.equals(content2);
}

// Get files that are different or new compared to default
// Returns: { filesToCopy: string[], stats: { new, modified, unchanged } }
function getDiffFiles(sourceDir, defaultDir) {
    const result = {
        filesToCopy: [],
        stats: { new: 0, modified: 0, unchanged: 0 }
    };

    if (!fs.existsSync(sourceDir)) return result;

    const sourceFiles = getAllFiles(sourceDir);
    const defaultFiles = new Set(fs.existsSync(defaultDir) ? getAllFiles(defaultDir) : []);

    for (const relPath of sourceFiles) {
        const sourcePath = path.join(sourceDir, relPath);
        const defaultPath = path.join(defaultDir, relPath);

        if (!defaultFiles.has(relPath)) {
            // New file - not in default
            result.filesToCopy.push(relPath);
            result.stats.new++;
        } else if (!filesAreEqual(sourcePath, defaultPath)) {
            // Modified file - different from default
            result.filesToCopy.push(relPath);
            result.stats.modified++;
        } else {
            // Unchanged - same as default, don't copy
            result.stats.unchanged++;
        }
    }

    return result;
}

// Copy only diff files from source to target
function copyDiffFiles(sourceDir, targetDir, filesToCopy) {
    for (const relPath of filesToCopy) {
        const sourcePath = path.join(sourceDir, relPath);
        const targetPath = path.join(targetDir, relPath);

        fs.ensureDirSync(path.dirname(targetPath));
        fs.copyFileSync(sourcePath, targetPath);
    }
}

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

// LOAD: Template -> Workspace (DEFAULT + OVERLAY)
// For non-default templates: First loads default, then overlays template files
program
  .command('load <templateName>')
  .description('Load a template into the workspace (default + template overlay)')
  .option('-f, --force', 'Force overwrite of current workspace', false)
  .action(async (templateName, options) => {
    const isDefault = templateName === 'default';
    const templateDir = isDefault
        ? defaultTemplateDir
        : path.join(templatesDir, templateName);

    // Validate template exists
    if (!fs.existsSync(templateDir)) {
        if (isDefault) {
            console.error(chalk.red(`❌ Default template backup not found at ${templateDir}`));
            console.log(chalk.yellow('   Run "npm run template:save default" first to create the backup.'));
            console.log(chalk.yellow('   Or use git: git checkout src content static site.config.js'));
        } else {
            console.error(chalk.red(`❌ Template '${templateName}' not found in ${templatesDir}`));
        }
        return;
    }

    // For non-default templates, we need default to exist
    if (!isDefault && !fs.existsSync(defaultTemplateDir)) {
        console.error(chalk.red('❌ Default template backup not found.'));
        console.log(chalk.yellow('   Run "npm run template:save default" first.'));
        console.log(chalk.yellow('   Templates are loaded as: default + template overlay'));
        return;
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}' into workspace...`));
    if (!options.force) {
        console.log(chalk.yellow('⚠️  Warning: This will overwrite:'));
        console.log(chalk.yellow('   - src/ (routes, lib)'));
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
        // For non-default: Load default first, then overlay template
        // For default: Just load default
        const loadOrder = isDefault ? [defaultTemplateDir] : [defaultTemplateDir, templateDir];

        console.log(chalk.gray(isDefault
            ? '  Loading default template...'
            : '  Step 1: Loading default as base...'
        ));

        for (let i = 0; i < loadOrder.length; i++) {
            const sourceDir = loadOrder[i];
            const isOverlay = i > 0;

            if (isOverlay) {
                console.log(chalk.gray(`  Step 2: Overlaying '${templateName}' template...`));
            }

            // 1. Handle src folder
            const sourceSrc = path.join(sourceDir, 'src');
            if (fs.existsSync(sourceSrc)) {
                if (!isOverlay) {
                    // First pass: clear routes, keep lib core
                    fs.emptyDirSync(path.join(targetSrc, 'routes'));
                }
                fs.copySync(sourceSrc, targetSrc, { overwrite: true });
                console.log(chalk.gray(`    ✓ ${isOverlay ? 'Overlaid' : 'Copied'} src/`));
            }

            // 2. Handle static folder
            const sourceStatic = path.join(sourceDir, 'static');
            if (fs.existsSync(sourceStatic)) {
                if (!isOverlay) {
                    fs.emptyDirSync(targetStatic);
                }
                fs.copySync(sourceStatic, targetStatic, { overwrite: true });
                console.log(chalk.gray(`    ✓ ${isOverlay ? 'Overlaid' : 'Copied'} static/`));
            }

            // 3. Handle content folder
            const sourceContent = path.join(sourceDir, 'content');
            if (fs.existsSync(sourceContent)) {
                if (!isOverlay) {
                    fs.emptyDirSync(targetContent);
                }
                fs.copySync(sourceContent, targetContent, { overwrite: true });
                console.log(chalk.gray(`    ✓ ${isOverlay ? 'Overlaid' : 'Copied'} content/`));
            }

            // 4. Handle site.config.js (overlay replaces)
            const sourceConfig = path.join(sourceDir, 'site.config.js');
            if (fs.existsSync(sourceConfig)) {
                fs.copySync(sourceConfig, targetConfig, { overwrite: true });
                console.log(chalk.gray(`    ✓ ${isOverlay ? 'Replaced' : 'Copied'} site.config.js`));
            }

            // 5. Merge template package.json dependencies (only for overlay)
            if (isOverlay) {
                const templatePkgPath = path.join(sourceDir, 'package.json');
                if (fs.existsSync(templatePkgPath)) {
                    const templatePkg = JSON.parse(fs.readFileSync(templatePkgPath, 'utf8'));
                    if (mergeTemplatePackageJson(targetPackageJson, templatePkg)) {
                        console.log(chalk.gray('    ✓ Merged template dependencies into package.json'));
                    }
                }
            }
        }

        console.log('');
        console.log(chalk.green(`✅ Template '${templateName}' loaded successfully!`));
        if (!isDefault) {
            console.log(chalk.gray('   Loaded as: default (base) + template (overlay)'));
        }
        console.log(chalk.yellow('Run "npm install && npm run dev" to test it.'));
    } catch (e) {
        console.error(chalk.red('Error loading template:'), e);
    }
  });

// SAVE: Workspace -> Template (DIFF-BASED)
// Only saves files that are different from default
program
  .command('save <templateName>')
  .description('Save current workspace into a template (only files different from default)')
  .option('--full', 'Save all files without diff comparison (for default template backup)')
  .action(async (templateName, options) => {
    const isDefault = templateName === 'default';
    const targetTemplateDir = isDefault
        ? defaultTemplateDir
        : path.join(templatesDir, templateName);

    // For non-default templates, we need default to exist for comparison
    if (!isDefault && !fs.existsSync(defaultTemplateDir)) {
        console.log(chalk.yellow('⚠️  Default template backup not found.'));
        console.log(chalk.yellow('   Run "npm run template:save default" first to create the baseline.'));
        console.log(chalk.yellow('   This is needed to compare and save only the differences.'));
        return;
    }

    console.log(chalk.blue(`💾 Saving ${isDefault ? 'default template backup' : `template '${templateName}' (diff-based)`}...`));

    // Sources from workspace
    const sourceSrc = path.join(rootDir, 'src');
    const sourceStatic = path.join(rootDir, 'static');
    const sourceContent = path.join(rootDir, 'content');
    const sourceConfig = path.join(rootDir, 'site.config.js');
    const sourcePackageJson = path.join(rootDir, 'package.json');

    // Default paths for comparison
    const defaultSrc = path.join(defaultTemplateDir, 'src');
    const defaultStatic = path.join(defaultTemplateDir, 'static');
    const defaultContent = path.join(defaultTemplateDir, 'content');
    const defaultConfig = path.join(defaultTemplateDir, 'site.config.js');

    // Ensure template dir exists and is clean
    if (fs.existsSync(targetTemplateDir)) {
        fs.emptyDirSync(targetTemplateDir);
    }
    fs.ensureDirSync(targetTemplateDir);

    let totalStats = { new: 0, modified: 0, unchanged: 0 };

    try {
        // For default template: save everything (full backup)
        // For other templates: save only diff from default
        const useFullCopy = isDefault || options.full;

        // 1. Handle src folder
        if (fs.existsSync(sourceSrc)) {
            const targetSrc = path.join(targetTemplateDir, 'src');

            if (useFullCopy) {
                fs.copySync(sourceSrc, targetSrc);
                console.log(chalk.gray('  ✓ Saved src/ (full)'));
            } else {
                const diff = getDiffFiles(sourceSrc, defaultSrc);
                if (diff.filesToCopy.length > 0) {
                    copyDiffFiles(sourceSrc, targetSrc, diff.filesToCopy);
                    console.log(chalk.gray(`  ✓ Saved src/ (${diff.stats.new} new, ${diff.stats.modified} modified, ${diff.stats.unchanged} unchanged)`));
                } else {
                    console.log(chalk.gray('  - src/ skipped (no changes from default)'));
                }
                totalStats.new += diff.stats.new;
                totalStats.modified += diff.stats.modified;
                totalStats.unchanged += diff.stats.unchanged;
            }
        }

        // 2. Handle static folder
        if (fs.existsSync(sourceStatic)) {
            const targetStatic = path.join(targetTemplateDir, 'static');

            if (useFullCopy) {
                fs.copySync(sourceStatic, targetStatic);
                console.log(chalk.gray('  ✓ Saved static/ (full)'));
            } else {
                const diff = getDiffFiles(sourceStatic, defaultStatic);
                if (diff.filesToCopy.length > 0) {
                    copyDiffFiles(sourceStatic, targetStatic, diff.filesToCopy);
                    console.log(chalk.gray(`  ✓ Saved static/ (${diff.stats.new} new, ${diff.stats.modified} modified, ${diff.stats.unchanged} unchanged)`));
                } else {
                    console.log(chalk.gray('  - static/ skipped (no changes from default)'));
                }
                totalStats.new += diff.stats.new;
                totalStats.modified += diff.stats.modified;
                totalStats.unchanged += diff.stats.unchanged;
            }
        }

        // 3. Handle content folder
        if (fs.existsSync(sourceContent)) {
            const targetContent = path.join(targetTemplateDir, 'content');

            if (useFullCopy) {
                fs.copySync(sourceContent, targetContent);
                console.log(chalk.gray('  ✓ Saved content/ (full)'));
            } else {
                const diff = getDiffFiles(sourceContent, defaultContent);
                if (diff.filesToCopy.length > 0) {
                    copyDiffFiles(sourceContent, targetContent, diff.filesToCopy);
                    console.log(chalk.gray(`  ✓ Saved content/ (${diff.stats.new} new, ${diff.stats.modified} modified, ${diff.stats.unchanged} unchanged)`));
                } else {
                    console.log(chalk.gray('  - content/ skipped (no changes from default)'));
                }
                totalStats.new += diff.stats.new;
                totalStats.modified += diff.stats.modified;
                totalStats.unchanged += diff.stats.unchanged;
            }
        }

        // 4. Handle site.config.js
        if (fs.existsSync(sourceConfig)) {
            const targetConfig = path.join(targetTemplateDir, 'site.config.js');

            if (useFullCopy) {
                fs.copySync(sourceConfig, targetConfig);
                console.log(chalk.gray('  ✓ Saved site.config.js'));
            } else if (!filesAreEqual(sourceConfig, defaultConfig)) {
                fs.copySync(sourceConfig, targetConfig);
                console.log(chalk.gray('  ✓ Saved site.config.js (modified)'));
                totalStats.modified++;
            } else {
                console.log(chalk.gray('  - site.config.js skipped (no changes from default)'));
                totalStats.unchanged++;
            }
        }

        // 5. Save template-specific dependencies from package.json
        if (!isDefault) {
            const templatePkg = getTemplatePackageJson(sourcePackageJson);
            if (templatePkg) {
                fs.writeFileSync(
                    path.join(targetTemplateDir, 'package.json'),
                    JSON.stringify(templatePkg, null, 2)
                );
                console.log(chalk.gray('  ✓ Saved package.json (template dependencies only)'));
            }
        }

        // Summary
        console.log('');
        if (isDefault) {
            console.log(chalk.green(`✅ Default template backed up to templates/_default/`));
        } else {
            console.log(chalk.green(`✅ Template '${templateName}' saved (diff-based)!`));
            console.log(chalk.gray(`   Summary: ${totalStats.new} new, ${totalStats.modified} modified, ${totalStats.unchanged} unchanged files`));

            // Check if template is empty (no differences)
            const templateFiles = getAllFiles(targetTemplateDir);
            if (templateFiles.length === 0) {
                console.log(chalk.yellow('   ⚠️  Template is empty - no differences from default found.'));
                fs.removeSync(targetTemplateDir);
            }
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
