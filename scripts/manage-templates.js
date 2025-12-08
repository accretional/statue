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
  .description('Load a template into the workspace (src/routes, content) for development')
  .option('-f, --force', 'Force overwrite of current workspace', false)
  .action(async (templateName, options) => {
    // Special handling for 'default'
    if (templateName === 'default') {
        console.log(chalk.yellow('⚠️  The "default" template lives in the project root (src/routes).'));
        console.log(chalk.yellow('   To restore the default template, please use git:'));
        console.log(chalk.white('   git checkout src/routes content site.config.js'));
        return;
    }

    const sourceTemplateDir = path.join(templatesDir, templateName);
    
    if (!fs.existsSync(sourceTemplateDir)) {
      console.error(chalk.red(`❌ Template '${templateName}' not found in ${templatesDir}`));
      return;
    }

    console.log(chalk.blue(`📂 Loading template '${templateName}' into workspace...`));
    if (!options.force) {
        console.log(chalk.yellow('⚠️  Warning: This will overwrite:'));
        console.log(chalk.yellow('   - src/routes/'));
        console.log(chalk.yellow('   - content/'));
        console.log(chalk.yellow('   - src/lib/components/ (if template has custom components)'));
        console.log(chalk.yellow('   - src/lib/themes/ (if template has custom themes)'));
        console.log(chalk.yellow('   - src/lib/index.ts and src/lib/index.css (if template has them)'));
        console.log(chalk.yellow('   Ensure you have committed your changes to "default" (or other templates).'));
        console.error(chalk.red('Operation aborted. Use -f or --force to proceed.'));
        return;
    }

    // Targets in workspace
    const targetRoutes = path.join(rootDir, 'src/routes');
    const targetContent = path.join(rootDir, 'content');
    const targetConfig = path.join(rootDir, 'site.config.js');
    const targetLibIndexTs = path.join(rootDir, 'src/lib/index.ts');
    const targetLibIndexCss = path.join(rootDir, 'src/lib/index.css');
    const targetLibComponents = path.join(rootDir, 'src/lib/components');
    const targetLibThemes = path.join(rootDir, 'src/lib/themes');

    // 1. Clear current workspace
    console.log(chalk.gray('Cleaning current workspace...'));
    fs.emptyDirSync(targetRoutes);
    fs.emptyDirSync(targetContent);

    // 2. Copy from Template -> Workspace
    try {
        // Routes
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/routes'))) {
            fs.copySync(path.join(sourceTemplateDir, 'src/routes'), targetRoutes);
            console.log(chalk.gray('  ✓ Copied src/routes'));
        }
        // Content
        if (fs.existsSync(path.join(sourceTemplateDir, 'content'))) {
            fs.copySync(path.join(sourceTemplateDir, 'content'), targetContent);
            console.log(chalk.gray('  ✓ Copied content'));
        }
        // Config
        if (fs.existsSync(path.join(sourceTemplateDir, 'site.config.js'))) {
            fs.copySync(path.join(sourceTemplateDir, 'site.config.js'), targetConfig);
            console.log(chalk.gray('  ✓ Copied site.config.js'));
        }

        // src/lib/index.ts
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/lib/index.ts'))) {
            fs.copySync(path.join(sourceTemplateDir, 'src/lib/index.ts'), targetLibIndexTs);
            console.log(chalk.gray('  ✓ Copied src/lib/index.ts'));
        }

        // src/lib/index.css
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/lib/index.css'))) {
            fs.copySync(path.join(sourceTemplateDir, 'src/lib/index.css'), targetLibIndexCss);
            console.log(chalk.gray('  ✓ Copied src/lib/index.css'));
        }

        // src/lib/components
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/lib/components'))) {
            // Clear existing custom components
            if (fs.existsSync(targetLibComponents)) {
                fs.emptyDirSync(targetLibComponents);
            }
            fs.copySync(path.join(sourceTemplateDir, 'src/lib/components'), targetLibComponents);
            console.log(chalk.gray('  ✓ Copied src/lib/components'));
        }

        // src/lib/themes
        if (fs.existsSync(path.join(sourceTemplateDir, 'src/lib/themes'))) {
            // Clear existing custom themes
            if (fs.existsSync(targetLibThemes)) {
                fs.emptyDirSync(targetLibThemes);
            }
            fs.copySync(path.join(sourceTemplateDir, 'src/lib/themes'), targetLibThemes);
            console.log(chalk.gray('  ✓ Copied src/lib/themes'));
        }

        console.log(chalk.green(`✅ Template '${templateName}' loaded successfully!`));
        console.log(chalk.yellow('Run "npm run dev" to test it.'));
    } catch (e) {
        console.error(chalk.red('Error loading template:'), e);
    }
  });

// SAVE: Workspace -> Template
program
  .command('save <templateName>')
  .description('Save current workspace (src/routes, content) into a template folder')
  .action(async (templateName) => {
    // Special handling for 'default'
    if (templateName === 'default') {
        console.log(chalk.green('✅  The "default" template is already in the project root.'));
        console.log(chalk.gray('   Just git commit your changes to save them.'));
        return;
    }

    const targetTemplateDir = path.join(templatesDir, templateName);
    
    console.log(chalk.blue(`💾 Saving workspace to template '${templateName}'...`));

    // Sources from workspace
    const sourceRoutes = path.join(rootDir, 'src/routes');
    const sourceContent = path.join(rootDir, 'content');
    const sourceConfig = path.join(rootDir, 'site.config.js');
    const sourceLibIndexTs = path.join(rootDir, 'src/lib/index.ts');
    const sourceLibIndexCss = path.join(rootDir, 'src/lib/index.css');
    const sourceLibComponents = path.join(rootDir, 'src/lib/components');
    const sourceLibThemes = path.join(rootDir, 'src/lib/themes');

    // 1. Ensure template dir exists
    fs.ensureDirSync(path.join(targetTemplateDir, 'src'));
    fs.ensureDirSync(path.join(targetTemplateDir, 'src/lib'));

    // 2. Copy Workspace -> Template
    try {
        // Routes
        if (fs.existsSync(sourceRoutes)) {
            fs.emptyDirSync(path.join(targetTemplateDir, 'src/routes'));
            fs.copySync(sourceRoutes, path.join(targetTemplateDir, 'src/routes'));
            console.log(chalk.gray('  ✓ Saved src/routes'));
        }
        // Content
        if (fs.existsSync(sourceContent)) {
            fs.emptyDirSync(path.join(targetTemplateDir, 'content'));
            fs.copySync(sourceContent, path.join(targetTemplateDir, 'content'));
            console.log(chalk.gray('  ✓ Saved content'));
        }
        // Config
        if (fs.existsSync(sourceConfig)) {
            fs.copySync(sourceConfig, path.join(targetTemplateDir, 'site.config.js'));
            console.log(chalk.gray('  ✓ Saved site.config.js'));
        }

        // src/lib/index.ts
        if (fs.existsSync(sourceLibIndexTs)) {
            fs.copySync(sourceLibIndexTs, path.join(targetTemplateDir, 'src/lib/index.ts'));
            console.log(chalk.gray('  ✓ Saved src/lib/index.ts'));
        }

        // src/lib/index.css
        if (fs.existsSync(sourceLibIndexCss)) {
            fs.copySync(sourceLibIndexCss, path.join(targetTemplateDir, 'src/lib/index.css'));
            console.log(chalk.gray('  ✓ Saved src/lib/index.css'));
        }

        // src/lib/components
        if (fs.existsSync(sourceLibComponents)) {
            const targetComponents = path.join(targetTemplateDir, 'src/lib/components');
            if (fs.existsSync(targetComponents)) {
                fs.emptyDirSync(targetComponents);
            }
            fs.copySync(sourceLibComponents, targetComponents);
            console.log(chalk.gray('  ✓ Saved src/lib/components'));
        }

        // src/lib/themes
        if (fs.existsSync(sourceLibThemes)) {
            const targetThemes = path.join(targetTemplateDir, 'src/lib/themes');
            if (fs.existsSync(targetThemes)) {
                fs.emptyDirSync(targetThemes);
            }
            fs.copySync(sourceLibThemes, targetThemes);
            console.log(chalk.gray('  ✓ Saved src/lib/themes'));
        }

        console.log(chalk.green(`✅ Workspace saved to template '${templateName}'!`));
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
