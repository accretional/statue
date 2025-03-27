// Node.js ile CMS modülünü build eden script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildCMS } from '../src/lib/cms/index.js';

// ES modules için __dirname eşdeğeri
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Building static site from content folder...');

// Async IIFE kullanarak async/await yapısını kuruyoruz
(async () => {
  try {
    // build klasörünü temizleme
    const buildDir = path.join(rootDir, 'build');
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
    
    // CMS build işlemini çalıştır (artık async)
    await buildCMS();
    console.log('Static site build completed successfully!');
  } catch (error) {
    console.error('Failed to build static site:', error);
    process.exit(1);
  }
})(); 