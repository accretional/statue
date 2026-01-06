#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

async function setupStatueSSG(options = {}) {
  const templateName = options.template || 'default';

  const __filename = fileURLToPath(import.meta.url);
  const sourceDir = path.dirname(__filename);
  const targetDir = process.cwd();

  console.log(chalk.blue(`🗿 Statue SSG - Initializing '${templateName}' template...`));

  // 1. Copy content
  const contentDir = path.join(sourceDir, 'content');
  if (fs.existsSync(contentDir)) {
    fs.copySync(contentDir, path.join(targetDir, 'content'), { overwrite: false });
    console.log(chalk.green('✓ content copied'));
  }

  // 2. Copy shared resources (favicon, robots.txt, etc.) - base layer
  const sharedDir = path.join(sourceDir, 'resources');
  if (fs.existsSync(sharedDir)) {
    fs.copySync(sharedDir, path.join(targetDir, 'static'), { overwrite: true });
    console.log(chalk.green('✓ shared resources copied'));
  }

  // 3. Copy template (src + site.config.js + static + scripts)
  // Always copy base files first (app.html, lib/index.css), then template overrides
  fs.copySync(path.join(sourceDir, 'src/app.html'), path.join(targetDir, 'src/app.html'), { overwrite: true });
  fs.ensureDirSync(path.join(targetDir, 'src/lib'));
  fs.copySync(path.join(sourceDir, 'src/lib/index.css'), path.join(targetDir, 'src/lib/index.css'), { overwrite: true });

  const templateDir = templateName === 'default' ? sourceDir : path.join(sourceDir, 'templates', templateName);

  // Copy routes
  fs.copySync(path.join(templateDir, 'src/routes'), path.join(targetDir, 'src/routes'), { overwrite: true });

  // Copy template's src/lib if exists (components, assets, etc.)
  const templateLibDir = path.join(templateDir, 'src/lib');
  if (fs.existsSync(templateLibDir)) {
    fs.copySync(templateLibDir, path.join(targetDir, 'src/lib'), { overwrite: true });
  }

  fs.copySync(path.join(templateDir, 'site.config.js'), path.join(targetDir, 'site.config.js'), { overwrite: true });

  // Copy template's static if exists (overlay on shared resources)
  const templateStaticDir = path.join(templateDir, 'static');
  if (fs.existsSync(templateStaticDir)) {
    fs.copySync(templateStaticDir, path.join(targetDir, 'static'), { overwrite: true });
  }

  // Copy template's scripts if exists
  const templateScriptsDir = path.join(templateDir, 'scripts');
  if (fs.existsSync(templateScriptsDir)) {
    fs.copySync(templateScriptsDir, path.join(targetDir, 'scripts'), { overwrite: true });
  }

  console.log(chalk.green(`✓ ${templateName} template copied`));

  // Copy template's content if exists
  const templateContentDir = path.join(templateDir, 'content');
  if (fs.existsSync(templateContentDir)) {
    fs.copySync(templateContentDir, path.join(targetDir, 'content'), { overwrite: true });
  }

  // 4. Copy build configs (svelte, vite, postcss) - always from root 
  for (const config of ['svelte.config.js', 'vite.config.js', 'postcss.config.js']) {
    const src = path.join(sourceDir, config);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(targetDir, config), { overwrite: true });
    }
  }
  console.log(chalk.green('✓ build configs copied'));

  // 5. Copy required scripts
  const scriptsDir = path.join(targetDir, 'scripts');
  fs.ensureDirSync(scriptsDir);
  for (const script of ['generate-seo-files.js', 'run-pagefind.js']) {
    fs.copySync(path.join(sourceDir, 'scripts', script), path.join(scriptsDir, script), { overwrite: true });
  }
  console.log(chalk.green('✓ scripts copied'));

  // 6. Update package.json - merge scripts and devDependencies from statue-ssg
  const pkgPath = path.join(targetDir, 'package.json');
  const sourcePkgPath = path.join(sourceDir, 'package.json');
  if (fs.existsSync(pkgPath) && fs.existsSync(sourcePkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const sourcePkg = JSON.parse(fs.readFileSync(sourcePkgPath, 'utf8'));

    pkg.scripts = { ...pkg.scripts, ...sourcePkg.scripts };
    pkg.devDependencies = { ...pkg.devDependencies, ...sourcePkg.devDependencies };

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(chalk.green('✓ package.json updated'));
  }

  console.log(chalk.green.bold('✨ Setup completed!'));
  return true;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--template');
  const template = idx !== -1 ? args[idx + 1] : 'default';
  setupStatueSSG({ template }).catch(err => {
    console.error(chalk.red('Setup failed:'), err);
    process.exit(1);
  });
}

export default setupStatueSSG;
