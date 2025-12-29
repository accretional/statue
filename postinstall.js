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

  // 2. Copy static from resources/{template} or resources/default
  const templateStaticDir = path.join(sourceDir, 'resources', templateName, 'static');
  const defaultStaticDir = path.join(sourceDir, 'resources/default/static');
  const staticSource = fs.existsSync(templateStaticDir) ? templateStaticDir : defaultStaticDir;
  if (fs.existsSync(staticSource)) {
    fs.copySync(staticSource, path.join(targetDir, 'static'), { overwrite: true });
    console.log(chalk.green('✓ static copied'));
  }

  // 3. Copy template (src + site.config.js)
  // Always copy base files first (app.html, lib/index.css), then template overrides
  fs.copySync(path.join(sourceDir, 'src/app.html'), path.join(targetDir, 'src/app.html'), { overwrite: true });
  fs.ensureDirSync(path.join(targetDir, 'src/lib'));
  fs.copySync(path.join(sourceDir, 'src/lib/index.css'), path.join(targetDir, 'src/lib/index.css'), { overwrite: true });

  const templateDir = templateName === 'default' ? sourceDir : path.join(sourceDir, 'templates', templateName);
  fs.copySync(path.join(templateDir, 'src/routes'), path.join(targetDir, 'src/routes'), { overwrite: true });
  fs.copySync(path.join(templateDir, 'site.config.js'), path.join(targetDir, 'site.config.js'), { overwrite: true });
  console.log(chalk.green(`✓ ${templateName} template copied`));

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
