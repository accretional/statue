#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// ESM ile __dirname elde etmek
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kullanıcının proje dizini (çalışılan dizin)
const targetDir = process.cwd();
console.log(chalk.green('Statue SSG dosyaları kopyalanıyor...'));
console.log(chalk.blue(`Hedef dizin: ${targetDir}`));

// Kaynak klasörleri (templatedeki dosyalar)
const sourceTemplate = path.join(__dirname, 'template');

// Hedef klasörler (kullanıcının projesindeki dizinler)
const targetSrc = path.join(targetDir, 'src');
const targetContent = path.join(targetDir, 'content');

// src klasörünü kopyala
try {
  if (!fs.existsSync(targetSrc)) {
    fs.ensureDirSync(targetSrc);
  }
  
  // src klasörü içindeki her şeyi kopyala
  fs.copySync(
    path.join(sourceTemplate, 'src'), 
    targetSrc, 
    { 
      overwrite: false,
      errorOnExist: false
    }
  );
  console.log(chalk.green('✓ src klasörü başarıyla kopyalandı'));
} catch (err) {
  console.error(chalk.red('src klasörü kopyalanırken bir hata oluştu:'), err);
}

// content klasörünü kopyala
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
    console.log(chalk.green('✓ content klasörü başarıyla kopyalandı'));
  } else {
    console.log(chalk.yellow('! content klasörü zaten mevcut, içerik kopyalanmadı'));
  }
} catch (err) {
  console.error(chalk.red('content klasörü kopyalanırken bir hata oluştu:'), err);
}

// root dosyalarını kopyala (svelte.config.js, tailwind.config.js vs.)
try {
  const rootFiles = ['svelte.config.js', 'tailwind.config.js', 'vite.config.js'];
  
  rootFiles.forEach(file => {
    const sourcePath = path.join(sourceTemplate, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
      fs.copySync(sourcePath, targetPath);
      console.log(chalk.green(`✓ ${file} başarıyla kopyalandı`));
    } else if (fs.existsSync(targetPath)) {
      console.log(chalk.yellow(`! ${file} zaten mevcut, üzerine yazılmadı`));
    }
  });
} catch (err) {
  console.error(chalk.red('Konfigürasyon dosyaları kopyalanırken bir hata oluştu:'), err);
}

// package.json içine gerekli bağımlılıkları ekle
try {
  const targetPackageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(targetPackageJsonPath)) {
    // Kullanıcının package.json dosyasını oku
    const packageJson = JSON.parse(fs.readFileSync(targetPackageJsonPath, 'utf8'));
    
    // Gerekli bağımlılıklar
    const dependencies = {
      'marked': '^4.2.4',
      'gray-matter': '^4.0.3'
    };
    
    // Eksik bağımlılıkları ekle
    let dependenciesAdded = false;
    for (const [dep, version] of Object.entries(dependencies)) {
      if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies[dep] = version;
        dependenciesAdded = true;
      }
    }
    
    // Değişiklikler yapıldıysa package.json'ı güncelle
    if (dependenciesAdded) {
      fs.writeFileSync(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(chalk.green('✓ package.json güncellendi, gerekli bağımlılıklar eklendi'));
      console.log(chalk.blue('Lütfen şimdi şu komutu çalıştırın: npm install'));
    } else {
      console.log(chalk.green('✓ Gerekli tüm bağımlılıklar zaten mevcut'));
    }
  }
} catch (err) {
  console.error(chalk.red('package.json güncellenirken bir hata oluştu:'), err);
}

console.log(chalk.green.bold('✨ Statue SSG kurulumu tamamlandı!'));
console.log(chalk.blue('Başlamak için:'));
console.log(chalk.white('1. Eğer bildirilen bağımlılıklar eklendiyse: npm install'));
console.log(chalk.white('2. Geliştirme sunucusunu başlatın: npm run dev'));
console.log(chalk.white('3. İçeriğinizi content/ klasörüne ekleyin'));
console.log(chalk.white('4. Statik sitenizi oluşturun: npm run build')); 