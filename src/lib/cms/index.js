import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
// ... existing code ...

// Svelte bileşenlerini derlemek için gereken modülleri import et
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';

// Content klasöründeki tüm alt dizinleri otomatik tespit edip döndürür
function detectContentDirectories() {
  const contentPath = path.resolve('content');
  const directories = [];
  
  if (fs.existsSync(contentPath)) {
    const items = fs.readdirSync(contentPath);
    
    items.forEach(item => {
      const itemPath = path.join(contentPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        directories.push({
          name: item,
          path: `content/${item}`,
          title: formatTitle(item),
          outputDir: item === 'pages' ? '' : item
        });
      }
    });
  }
  
  return directories;
}

export function loadConfig() {
  const configPath = path.resolve('src/_pagegroups/config.json');
  let config = {
    pageGroups: []
  };
  
  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch (error) {
      console.warn(`Warning: Could not parse config file: ${error.message}`);
    }
  } else {
    console.log('Config file not found, using auto-detected content directories');
  }
  
  // Config dosyası yoksa veya pageGroups tanımlı değilse, otomatik olarak dizinleri tespit et
  if (!config.pageGroups || config.pageGroups.length === 0) {
    const detectedDirs = detectContentDirectories();
    config.pageGroups = detectedDirs.map(dir => ({
      name: dir.name,
      title: dir.title,
      sourceDir: dir.path,
      format: 'markdown',
      outputDir: dir.outputDir,
      listable: true,
      hierarchical: dir.name === 'docs' // Docs için hiyerarşik görünüm aktif
    }));
  }
  
  // Initialize empty pages array for each page group
  config.pageGroups.forEach((group) => {
    group.pages = [];
  });
  
  return config;
}

export function processMarkdown(content) {
  const result = marked.parse(content);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}

export function processPageGroup(pageGroup) {
  const sourceDir = path.resolve(pageGroup.sourceDir);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Source directory ${sourceDir} for page group ${pageGroup.name} does not exist.`);
    return;
  }
  
  const files = getAllFiles(sourceDir);
  
  files.forEach(file => {
    if (path.extname(file) === '.md') {
      const relativePath = path.relative(sourceDir, file);
      const url = `/${pageGroup.outputDir}/${relativePath.replace(/\.md$/, '')}`;
      const slug = path.basename(file, '.md');
      
      const content = fs.readFileSync(file, 'utf-8');
      const { data, content: markdownContent } = matter(content);
      
      const page = {
        slug,
        path: relativePath,
        url,
        content: processMarkdown(markdownContent),
        metadata: data
      };
      
      pageGroup.pages.push(page);
    }
  });
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Temel şablon işleme fonksiyonu
function renderTemplate(templatePath, data) {
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  // Basit handlebars benzeri değişken değiştirme
  template = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    key = key.trim();
    
    // Koşullu ifade kontrolü
    if (key.startsWith('if ')) {
      // Bu temel template engine koşulları desteklemiyor,
      // bu yüzden gerçek değeri doğrudan döndürüyoruz
      return '';
    }
    
    // each döngüsü için - basit implementasyon
    if (key.startsWith('each ')) {
      return '';
    }
    
    // #if, #each kapatma taglerini temizle
    if (key.startsWith('/if') || key.startsWith('/each')) {
      return '';
    }
    
    // formatDate helper'ı
    if (key.startsWith('formatDate ')) {
      const datePath = key.replace('formatDate ', '');
      const dateValue = getNestedValue(data, datePath);
      if (dateValue) {
        return new Date(dateValue).toLocaleDateString();
      }
      return '';
    }
    
    // formatTitle helper'ı
    if (key.startsWith('formatTitle ')) {
      const slug = key.replace('formatTitle ', '');
      if (data[slug]) {
        return formatTitle(data[slug]);
      }
      return formatTitle(slug);
    }
    
    // Yıl için
    if (key === 'currentYear') {
      return new Date().getFullYear().toString();
    }
    
    // Nested değerler için
    return getNestedValue(data, key) || '';
  });
  
  // Koşullu blokları işle
  template = processConditionalBlocks(template, data);
  
  // Each bloklarını işle
  template = processEachBlocks(template, data);
  
  return template;
}

// Nested değerleri alma yardımcı fonksiyonu
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return '';
    }
    result = result[key];
  }
  
  return result !== undefined ? result : '';
}

// Koşullu blokları işleme
function processConditionalBlocks(template, data) {
  const ifRegex = /\{\{#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  return template.replace(ifRegex, (match, condition, content) => {
    condition = condition.trim();
    const value = getNestedValue(data, condition);
    
    if (value) {
      return processConditionalBlocks(content, data); // İç içe if'ler için recursive olarak işle
    }
    return '';
  });
}

// Each bloklarını işleme
function processEachBlocks(template, data) {
  const eachRegex = /\{\{#each ([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return template.replace(eachRegex, (match, arrayPath, itemTemplate) => {
    const array = getNestedValue(data, arrayPath);
    
    if (!Array.isArray(array)) {
      return '';
    }
    
    // Her öğe için şablonu işle ve sonuçları birleştir
    return array.map(item => {
      // "this" kullanımı için destek ekleyin
      const itemData = { ...data, this: item };
      let result = itemTemplate;
      
      // Öğe için temel değişkenleri işle
      result = result.replace(/\{\{([^}]+)\}\}/g, (m, key) => {
        key = key.trim();
        
        // Koşullu ve each ifadeleri burada atla
        if (key.startsWith('if ') || key.startsWith('/if') || 
            key.startsWith('each ') || key.startsWith('/each')) {
          return m;
        }
        
        // Öğe özelliklerine erişim
        if (key.includes('.')) {
          return getNestedValue(itemData, key) || '';
        }
        
        return item[key] !== undefined ? item[key] : '';
      });
      
      // İç içe koşullu ve each bloklarını işle
      result = processConditionalBlocks(result, item);
      result = processEachBlocks(result, item);
      
      return result;
    }).join('');
  });
}

// Slug'dan başlık formatı oluşturma helper fonksiyonu
function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Statik HTML dosyalarını doğrudan build klasörüne yazma
export async function generateStaticPages(pageGroup, outputBaseDir) {
  const outputDir = path.join(outputBaseDir, pageGroup.outputDir);
  
  // Output dizininin varlığını sağla
  fs.mkdirSync(outputDir, { recursive: true });

  // Tüm sayfalar için geçici bir dosya oluştur
  const tempDir = path.resolve('.tmp', 'pages', pageGroup.name);
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Her içerik dosyası için bir sayfa oluştur
  for (const page of pageGroup.pages) {
    const pageOutputDir = path.join(outputDir, path.dirname(page.path));
    fs.mkdirSync(pageOutputDir, { recursive: true });
    
    // Sayfa için klasör oluştur (clean URL'ler için)
    const pagePath = path.join(pageOutputDir, path.basename(page.path, '.md'));
    fs.mkdirSync(pagePath, { recursive: true });
    
    // Sayfanın verilerini oluştur
    const pageData = {
      title: page.metadata.title || formatTitle(page.slug),
      content: page.content,
      date: page.metadata.date,
      author: page.metadata.author,
      backLink: pageGroup.listable ? `/${pageGroup.outputDir}` : null,
      backLinkText: pageGroup.title,
      activePath: page.url,
      currentYear: new Date().getFullYear(),
      // Tüm sayfa gruplarını navbar için ekleyelim
      navbarItems: generateNavbarItems(outputBaseDir)
    };
    
    try {
      // Svelte entry file oluştur
      const entryContent = `
        import ContentPage from '../../../src/lib/components/ContentPage.svelte';
        
        new ContentPage({
          target: document.body,
          props: ${JSON.stringify(pageData)}
        });
      `;
      
      const entryPath = path.join(tempDir, `${page.slug}.js`);
      fs.writeFileSync(entryPath, entryContent);
      
      // Vite ile Svelte bileşenini derle
      await build({
        root: process.cwd(),
        publicDir: false,
        build: {
          outDir: path.join(outputBaseDir, 'assets', 'pages', pageGroup.name),
          emptyOutDir: false,
          rollupOptions: {
            input: entryPath,
            output: {
              entryFileNames: `${page.slug}.js`,
              chunkFileNames: 'chunks/[name]-[hash].js',
              assetFileNames: 'css/[name]-[hash].[ext]'
            }
          }
        },
        plugins: [svelte()]
      });
      
      // HTML içeriğini oluştur
      const pageHtml = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageData.title}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script type="module" src="/assets/pages/${pageGroup.name}/${page.slug}.js" defer></script>
        </head>
        <body>
          <!-- Svelte bileşeni buraya mount edilecek -->
        </body>
        </html>
      `;
      
      fs.writeFileSync(path.join(pagePath, 'index.html'), pageHtml);
    } catch (error) {
      console.error(`Failed to build Svelte component for page ${page.slug}:`, error);
      
      // Hata durumunda eski şablonu kullan
      console.log(`Falling back to template-based page generation for ${page.slug}...`);
      const templatePath = path.resolve('src/lib/templates/page.html');
      const pageContent = renderTemplate(templatePath, pageData);
      fs.writeFileSync(path.join(pagePath, 'index.html'), pageContent);
    }
  }
  
  // Listable true ise, indeks sayfası oluştur
  if (pageGroup.listable || pageGroup.pages.length === 0) {
    // Klasörde md dosyası olmasa bile indeks sayfası oluştur
    await createIndexPage(pageGroup, outputDir, outputBaseDir);
  }
}

// Navbar için menü öğeleri oluştur
function generateNavbarItems(outputBaseDir) {
  // Content klasöründeki tüm dizinleri tespit et
  const contentDirs = detectContentDirectories();
  
  return contentDirs.map(dir => ({
    title: dir.title,
    url: `/${dir.outputDir}`
  }));
}

// Klasör için indeks sayfası oluştur
async function createIndexPage(pageGroup, outputDir, outputBaseDir) {
  // Liste sayfası için verileri hazırla
  const organizedPages = {};
  
  if (pageGroup.hierarchical) {
    // Hiyerarşik görünüm için sayfaları organize et
    pageGroup.pages.forEach(page => {
      const pathParts = page.path.split('/');
      // Son kısmı (dosya adını) kaldır
      pathParts.pop();
      
      const parentPath = pathParts.join('/');
      
      if (!organizedPages[parentPath]) {
        organizedPages[parentPath] = {
          path: parentPath,
          pages: []
        };
      }
      
      organizedPages[parentPath].pages.push({
        title: page.metadata.title || formatTitle(page.slug),
        url: page.url,
        description: page.metadata.description,
        date: page.metadata.date
      });
    });
  }
  
  const listData = {
    title: pageGroup.title,
    hierarchical: pageGroup.hierarchical,
    organizedPages: Object.values(organizedPages),
    pages: pageGroup.pages.map(p => ({
      title: p.metadata.title || formatTitle(p.slug),
      url: p.url,
      description: p.metadata.description,
      date: p.metadata.date
    })),
    currentYear: new Date().getFullYear(),
    activePath: `/${pageGroup.outputDir}`,
    // Tüm sayfa gruplarını navbar için ekleyelim
    navbarItems: generateNavbarItems(outputBaseDir)
  };
  
  try {
    // Svelte bileşeni için geçici dosya oluştur
    const tempDir = path.resolve('.tmp', 'indexes');
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Svelte entry file oluştur
    const entryContent = `
      import ContentList from '../../../src/lib/components/ContentList.svelte';
      
      new ContentList({
        target: document.body,
        props: ${JSON.stringify(listData)}
      });
    `;
    
    const entryPath = path.join(tempDir, `${pageGroup.name}-index.js`);
    fs.writeFileSync(entryPath, entryContent);
    
    // Vite ile Svelte bileşenini derle
    await build({
      root: process.cwd(),
      publicDir: false,
      build: {
        outDir: path.join(outputBaseDir, 'assets', 'indexes'),
        emptyOutDir: false,
        rollupOptions: {
          input: entryPath,
          output: {
            entryFileNames: `${pageGroup.name}-index.js`,
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'css/[name]-[hash].[ext]'
          }
        }
      },
      plugins: [svelte()]
    });
    
    // HTML içeriğini oluştur
    const listHtml = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${listData.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script type="module" src="/assets/indexes/${pageGroup.name}-index.js" defer></script>
      </head>
      <body>
        <!-- Svelte bileşeni buraya mount edilecek -->
      </body>
      </html>
    `;
    
    fs.writeFileSync(path.join(outputDir, 'index.html'), listHtml);
  } catch (error) {
    console.error(`Failed to build Svelte component for index page of ${pageGroup.name}:`, error);
    
    // Hata durumunda eski şablonu kullan
    console.log(`Falling back to template-based index page generation for ${pageGroup.name}...`);
    const templatePath = path.resolve('src/lib/templates/list.html');
    const listPageContent = renderTemplate(templatePath, listData);
    fs.writeFileSync(path.join(outputDir, 'index.html'), listPageContent);
  }
}

// Ana sayfa oluşturma
async function generateHomepage(config, outputBaseDir) {
  // Eski şablon tabanlı yaklaşım
  const templatePath = path.resolve('src/lib/templates/home.html');
  
  const homeData = {
    pageGroups: config.pageGroups,
    currentYear: new Date().getFullYear(),
    // Tüm sayfa gruplarını navbar için ekleyelim
    navbarItems: generateNavbarItems(outputBaseDir)
  };
  
  // Svelte bileşeni için geçici dosya oluştur
  const tempDir = path.resolve('.tmp');
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Svelte entry point dosyası oluştur
  const entryContent = `
    import HomePage from '../src/lib/components/HomePage.svelte';
    
    new HomePage({
      target: document.body,
      props: ${JSON.stringify(homeData)}
    });
  `;
  
  const entryPath = path.join(tempDir, 'main.js');
  fs.writeFileSync(entryPath, entryContent);
  
  // Svelte bileşenini derle
  try {
    await build({
      root: process.cwd(),
      publicDir: 'static',
      build: {
        outDir: path.join(outputBaseDir, 'assets'),
        emptyOutDir: false,
        rollupOptions: {
          input: entryPath,
          output: {
            entryFileNames: 'js/home-bundle.js',
            chunkFileNames: 'js/[name]-[hash].js',
            assetFileNames: 'css/[name]-[hash].[ext]'
          }
        }
      },
      plugins: [svelte()]
    });
    
    // HTML içeriğini oluştur - Svelte komponenti için gerekli olan
    const homeHtml = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Statue SSG</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script type="module" src="/assets/js/home-bundle.js" defer></script>
      </head>
      <body>
        <!-- Svelte bileşeni buraya mount edilecek -->
      </body>
      </html>
    `;
    
    fs.writeFileSync(path.join(outputBaseDir, 'index.html'), homeHtml);
    console.log('Homepage with Svelte components built successfully.');
  } catch (error) {
    console.error('Failed to build Svelte components:', error);
    
    // Hata durumunda eski şablonu kullan
    console.log('Falling back to template-based homepage generation...');
    const homeContent = renderTemplate(templatePath, homeData);
    fs.writeFileSync(path.join(outputBaseDir, 'index.html'), homeContent);
  }
}

// buildCMS fonksiyonunu async yapalım
export async function buildCMS() {
  const config = loadConfig();
  const outputDir = 'build';
  
  // Build dizinini temizle ve yeniden oluştur
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Statik dosyaları kopyala
  if (fs.existsSync('static')) {
    copyDirectorySync('static', outputDir);
  }
  
  // Tüm sayfa gruplarını işle
  config.pageGroups.forEach(pageGroup => {
    processPageGroup(pageGroup);
    generateStaticPages(pageGroup, outputDir);
  });
  
  // Ana sayfa oluştur (artık async)
  await generateHomepage(config, outputDir);
  
  console.log('CMS build completed successfully.');
}

// Dizin kopyalama yardımcı fonksiyonu
function copyDirectorySync(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectorySync(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
} 