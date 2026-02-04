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

  // 1. Copy shared resources (favicon, robots.txt, etc.) - base layer
  const sharedDir = path.join(sourceDir, 'resources');
  if (fs.existsSync(sharedDir)) {
    fs.copySync(sharedDir, path.join(targetDir, 'static'), { overwrite: true });
    console.log(chalk.green('✓ shared resources copied'));
  }

  // 3. Copy template (src + site.config.json + static + scripts)
  const templateDir = path.join(sourceDir, 'templates', templateName);

  // Copy routes
  fs.copySync(path.join(templateDir, 'src/routes'), path.join(targetDir, 'src/routes'), { overwrite: true });

  // Apply canonical SSG config (overwrites template's +layout.js if present)
  const sharedLayoutPath = path.join(sourceDir, 'templates', '_shared', 'src', 'routes', '+layout.js');
  if (fs.existsSync(sharedLayoutPath)) {
    fs.copySync(sharedLayoutPath, path.join(targetDir, 'src', 'routes', '+layout.js'), { overwrite: true });
  }

  // Copy template's src/lib if exists (components, assets, etc.)
  const templateLibDir = path.join(templateDir, 'src/lib');
  if (fs.existsSync(templateLibDir)) {
    fs.copySync(templateLibDir, path.join(targetDir, 'src/lib'), { overwrite: true });
  }

  fs.copySync(path.join(templateDir, 'site.config.json'), path.join(targetDir, 'site.config.json'), { overwrite: true });

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

  // Copy template's config files if exists (orval.config.ts, etc.)
  for (const config of ['orval.config.ts', 'orval.config.js']) {
    const src = path.join(templateDir, config);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(targetDir, config), { overwrite: true });
      console.log(chalk.green(`✓ ${config} copied`));
    }
  }

  console.log(chalk.green(`✓ ${templateName} template copied`));

  // Copy template's content if exists, otherwise use default content as fallback
  const templateContentDir = path.join(templateDir, 'content');
  const contentSource = fs.existsSync(templateContentDir)
    ? templateContentDir
    : path.join(sourceDir, 'templates', 'default', 'content');

  if (fs.existsSync(contentSource)) {
    fs.copySync(contentSource, path.join(targetDir, 'content'), { overwrite: true });
    console.log(chalk.green(`✓ content copied (${fs.existsSync(templateContentDir) ? templateName : 'default'})`));
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
  for (const script of ['generate-exports.js', 'generate-seo-files.js', 'run-pagefind.js', 'run-orval.js', 'generate-rss-feed.js']) {
    fs.copySync(path.join(sourceDir, 'scripts', script), path.join(scriptsDir, script), { overwrite: true });
  }
  console.log(chalk.green('✓ scripts copied'));

  // 6. Update package.json - merge scripts and devDependencies from statue-ssg
  const pkgPath = path.join(targetDir, 'package.json');
  const sourcePkgPath = path.join(sourceDir, 'package.json');
  if (fs.existsSync(pkgPath) && fs.existsSync(sourcePkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const sourcePkg = JSON.parse(fs.readFileSync(sourcePkgPath, 'utf8'));

    let scriptsToInclude = ['preview', 'postbuild', 'setup'];

    // For swagger template, include Orval-related scripts
    if (templateName === 'swagger') {
      scriptsToInclude = ['preview', 'postbuild', 'setup', 'prebuild', 'predev', 'dev', 'generate-api', 'generate:exports'];
    }

    const productionScripts = Object.fromEntries(
      Object.entries(sourcePkg.scripts).filter(([name]) => scriptsToInclude.includes(name))
    );

    pkg.scripts = { ...pkg.scripts, ...productionScripts };
    pkg.devDependencies = { ...sourcePkg.devDependencies, ...pkg.devDependencies };

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
