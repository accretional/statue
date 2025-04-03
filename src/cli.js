import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import { generateStaticSite } from './index.js';
import { execSync } from 'child_process';

// Handle __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up CLI
const program = new Command();

program
  .name('statue-ssg')
  .description('Convert markdown content to a static website')
  .version('0.1.2');

program
  .command('build')
  .description('Build a static site from markdown content')
  .option('-i, --input <directory>', 'input content directory', 'content')
  .option('-o, --output <directory>', 'output directory', 'build')
  .option('-t, --template <path>', 'custom template directory')
  .option('-v, --verbose', 'verbose output')
  .action(async (options) => {
    console.log(chalk.bold.green('Statue SSG - Static Site Generator'));
    
    try {
      await generateStaticSite({
        inputDir: options.input,
        outputDir: options.output,
        template: options.template,
        verbose: options.verbose
      });
      
      console.log(chalk.green('✨ Static site generated successfully!'));
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program
  .command('setup')
  .description('Set up Statue SSG in your SvelteKit project')
  .action(() => {
    try {
      // Check if we're in a SvelteKit project
      const pkgPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(pkgPath)) {
        console.error(chalk.red('Error: No package.json found. Please run this command in a SvelteKit project.'));
        process.exit(1);
      }
      
      // Read package.json to verify it's a SvelteKit project
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!pkg.dependencies?.['@sveltejs/kit'] && !pkg.devDependencies?.['@sveltejs/kit']) {
        console.warn(chalk.yellow('Warning: This doesn\'t appear to be a SvelteKit project.'));
        const proceed = true; // In a real CLI, you would prompt the user here
        if (!proceed) {
          console.log(chalk.blue('Setup cancelled.'));
          process.exit(0);
        }
      }
      
      console.log(chalk.green('Setting up Statue SSG in your project...'));
      
      // Find the postinstall.js script
      const postinstallPath = path.resolve(__dirname, '..', 'postinstall.js');
      if (fs.existsSync(postinstallPath)) {
        // Run the postinstall script
        try {
          console.log(chalk.blue('Running setup script...'));
          // We're using require() to execute the script directly
          require(postinstallPath);
        } catch (e) {
          // If direct execution fails, try running with node
          try {
            console.log(chalk.blue('Trying alternative method...'));
            execSync(`node "${postinstallPath}"`, { stdio: 'inherit' });
          } catch (err) {
            console.error(chalk.red('Error executing postinstall script:'), err.message);
            process.exit(1);
          }
        }
      } else {
        console.error(chalk.red('Error: Setup script not found.'));
        console.log(chalk.yellow('Try running: node node_modules/statue-ssg/postinstall.js'));
        process.exit(1);
      }
    } catch (err) {
      console.error(chalk.red('Error during setup:'), err.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new Statue SSG project')
  .option('-d, --directory <n>', 'project directory name', '.')
  .option('-s, --sveltekit', 'initialize with SvelteKit integration')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.directory);
    
    try {
      if (options.sveltekit) {
        // SvelteKit entegrasyonu ile başlat
        console.log(chalk.green('SvelteKit entegrasyonu ile Statue SSG başlatılıyor...'));
        
        // Önce klasör yapısını kontrol et
        if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
          console.log(chalk.yellow('Mevcut bir SvelteKit projesinde değilsiniz.'));
          console.log(chalk.blue('Önce bir SvelteKit projesi oluşturun:'));
          console.log(chalk.white('npm create svelte@latest my-app'));
          console.log(chalk.white('cd my-app'));
          console.log(chalk.white('npm install'));
          console.log(chalk.white('npm install statue-ssg'));
          process.exit(0);
        }
        
        // postinstall.js veya entegrasyon scriptini çalıştır
        try {
          console.log(chalk.blue('Statue SSG dosyaları kopyalanıyor...'));
          const postinstallPath = path.join(__dirname, '..', 'postinstall.js');
          
          if (fs.existsSync(postinstallPath)) {
            // Node.js ile script'i çalıştır
            execSync(`node ${postinstallPath}`, { stdio: 'inherit' });
          } else {
            console.error(chalk.red('postinstall.js dosyası bulunamadı.'));
            console.log(chalk.yellow('Manuel olarak kurulum yapılıyor...'));
            
            // Manual olarak kurulum dizinlerini oluştur
            fs.ensureDirSync(path.join(targetDir, 'content'));
            fs.ensureDirSync(path.join(targetDir, 'content/blog'));
            fs.ensureDirSync(path.join(targetDir, 'content/docs'));
            fs.ensureDirSync(path.join(targetDir, 'content/static'));
            
            console.log(chalk.green('✅ İçerik klasörleri oluşturuldu.'));
          }
        } catch (err) {
          console.error(chalk.red('Entegrasyon sırasında hata oluştu:'), err.message);
        }
        
        console.log(chalk.green('✅ SvelteKit entegrasyonu tamamlandı!'));
        console.log();
        console.log('Sonraki adımlar:');
        console.log('  1. Bağımlılıkları yükleyin:', chalk.bold('npm install'));
        console.log('  2. Geliştirme sunucusunu başlatın:', chalk.bold('npm run dev'));
        console.log('  3. content/ dizinindeki içeriği düzenleyin');
      }
      else {
        // Standard statue-ssg başlat (eski fonksiyonalite)
        // Create directory structure
        fs.ensureDirSync(targetDir);
        fs.ensureDirSync(path.join(targetDir, 'content'));
        fs.ensureDirSync(path.join(targetDir, 'content/blog'));
        fs.ensureDirSync(path.join(targetDir, 'content/docs'));
        fs.ensureDirSync(path.join(targetDir, 'content/static'));
        
        // Create example content
        const exampleContent = `---
title: Hello World
description: Welcome to Statue SSG
date: ${new Date().toISOString().split('T')[0]}
---

# Welcome to Statue SSG

This is an example markdown file.

## Features

- Simple markdown content
- Fast static site generation
- SEO friendly

`;
        
        fs.writeFileSync(path.join(targetDir, 'content/blog/hello-world.md'), exampleContent);
        
        // Create package.json if it doesn't exist
        const pkgPath = path.join(targetDir, 'package.json');
        if (!fs.existsSync(pkgPath)) {
          const pkg = {
            name: path.basename(targetDir),
            version: '0.0.1',
            description: 'A static site built with Statue SSG',
            type: 'module',
            scripts: {
              build: 'statue-ssg build',
              dev: 'statue-ssg build && serve build'
            },
            dependencies: {
              'statue-ssg': '^0.1.2'
            },
            devDependencies: {
              serve: '^14.0.0'
            }
          };
          
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        }
        
        console.log(chalk.green('✅ Statue SSG projesi başlatıldı!'));
        console.log();
        console.log('Sonraki adımlar:');
        console.log('  1. Bağımlılıkları yükleyin:', chalk.bold('npm install'));
        console.log('  2. Statik siteyi oluşturun:', chalk.bold('npm run build'));
        console.log('  3. content/ dizinindeki içeriği düzenleyin');
      }
    } catch (err) {
      console.error(chalk.red('Hata:'), err.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
