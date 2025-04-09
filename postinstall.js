#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User's project directory (working directory)
const targetDir = process.cwd();
console.log(chalk.green('Copying Statue SSG files...'));
console.log(chalk.blue(`Target directory: ${targetDir}`));

// Source folders (files in template)
const sourceTemplate = path.join(__dirname, 'template');

// Target folders (directories in user's project)
const targetSrc = path.join(targetDir, 'src');
const targetContent = path.join(targetDir, 'content');

// Copy src folder
try {
  if (!fs.existsSync(targetSrc)) {
    fs.ensureDirSync(targetSrc);
  }
  
  // Copy everything in src folder
  fs.copySync(
    path.join(sourceTemplate, 'src'), 
    targetSrc, 
    { 
      overwrite: true,
      errorOnExist: false
    }
  );
  console.log(chalk.green('✓ src folder copied successfully'));
} catch (err) {
  console.error(chalk.red('An error occurred while copying src folder:'), err);
}

// Copy content folder
try {
  if (!fs.existsSync(targetContent)) {
    fs.ensureDirSync(targetContent);
    fs.copySync(
      path.join(sourceTemplate, 'content'), 
      targetContent, 
      { 
        overwrite: false,
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

// Copy root files (svelte.config.js, tailwind.config.js etc.)
try {
  const rootFiles = ['svelte.config.js', 'tailwind.config.js', 'vite.config.js'];
  
  rootFiles.forEach(file => {
    const sourcePath = path.join(sourceTemplate, file);
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
      'marked': '^4.2.4',
      'gray-matter': '^4.0.3'
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
console.log(chalk.blue('To get started:'));
console.log(chalk.white('1. If dependencies were added: npm install'));
console.log(chalk.white('2. Start the development server: npm run dev'));
console.log(chalk.white('3. Add your content to the content/ folder'));
console.log(chalk.white('4. Build your static site: npm run build')); 