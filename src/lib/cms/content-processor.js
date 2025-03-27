// Node.js spesifik modülleri yalnızca sunucu tarafında çalışmalıdır
// Bu dosya yalnızca sunucu tarafında (+page.server.js veya +layout.server.js) içe aktarılmalıdır

// Tarayıcıda çalışmayı engellemek için önlemler
import { browser } from '$app/environment';

// Node.js modülleri 
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// Bu hata kontrolü, bu modülün tarayıcıda kullanılmaya çalışıldığında erken uyarı vermek içindir
if (browser) {
  console.error('content-processor.js yalnızca sunucu tarafında kullanılmalıdır!');
  throw new Error('Content processor istemci tarafında çalıştırılamaz!');
}

// Content klasöründeki tüm markdown dosyalarını ve klasörleri tarar
const scanContentDirectory = () => {
  const contentPath = path.resolve('content');
  const contentEntries = [];
  
  if (!fs.existsSync(contentPath)) {
    console.warn('Content klasörü bulunamadı!');
    return contentEntries;
  }
  
  // Recursive olarak content klasörünü tara
  function scanDir(dirPath, relativePath = '') {
    const entries = fs.readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const entryRelativePath = path.join(relativePath, entry);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Klasör ise içini tara
        scanDir(fullPath, entryRelativePath);
      } else if (stats.isFile() && entry.endsWith('.md')) {
        // Markdown dosyalarını listeye ekle
        const slug = entry.replace('.md', '');
        const url = relativePath 
          ? `/${relativePath}/${slug}`.replace(/\\/g, '/') 
          : `/${slug}`;
          
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        const html = marked.parse(markdownContent);
        
        // Directory'yi düzelt - tam path'i kullan
        let directory = relativePath.replace(/\\/g, '/');
        
        // İçerik ağacını oluşturmak için ana dizin bilgisini ekle
        // Örneğin: blog/kategoriler/js -> blog
        const mainDirectory = directory.split('/')[0] || 'root';
        
        contentEntries.push({
          slug,
          path: entryRelativePath,
          url,
          directory,
          mainDirectory,
          // Path'in derinliği
          depth: directory === '' ? 0 : directory.split('/').length,
          content: html,
          metadata: {
            title: data.title || formatTitle(slug),
            description: data.description || '',
            date: data.date || null,
            author: data.author || null,
            ...data
          }
        });
      }
    }
  }
  
  // Content klasörünü taramaya başla
  scanDir(contentPath);
  
  return contentEntries;
};

// Content klasöründeki klasörleri tespit eden fonksiyon
const getContentDirectories = () => {
  const contentPath = path.resolve('content');
  const directories = [];
  
  if (!fs.existsSync(contentPath)) {
    console.warn('Content klasörü bulunamadı!');
    return directories;
  }
  
  const entries = fs.readdirSync(contentPath);
  
  for (const entry of entries) {
    const fullPath = path.join(contentPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      directories.push({
        name: entry,
        path: `content/${entry}`,
        title: formatTitle(entry),
        url: `/${entry}`
      });
    }
  }
  
  return directories;
};

// Markdown içeriğini belirli bir başlığa kadar kısaltan fonksiyon
const truncateContent = (content, maxLength = 200) => {
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength) + '...';
};

// Slug'dan başlık oluşturma fonksiyonu
const formatTitle = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Tüm içeriği bir kere tarayıp önbelleğe almak için
let cachedContent = null;

// Tüm içeriği getir (önbellek kullanarak)
const getAllContent = () => {
  if (cachedContent) return cachedContent;
  
  cachedContent = scanContentDirectory();
  return cachedContent;
};

// Belirli bir URL için içerik getir
const getContentByUrl = (url) => {
  const allContent = getAllContent();
  return allContent.find(entry => entry.url === url);
};

// Belirli bir klasördeki içeriği getir
const getContentByDirectory = (directory) => {
  const allContent = getAllContent();
  
  // Ana dizinler için doğrudan eşleşme yapıyoruz
  if (directory === 'root') {
    return allContent.filter(entry => entry.directory === 'root');
  }
  
  // Alt dizinler de dahil olmak üzere belirtilen dizinle başlayan tüm içerikleri getir
  return allContent.filter(entry => {
    // 1. Tam eşleşme durumu (ör: 'blog' için tam olarak 'blog' dizini)
    // 2. Alt klasör eşleşmesi (ör: 'blog' için 'blog/kategori' dizini)
    return entry.directory === directory || entry.directory.startsWith(directory + '/');
  });
};

// Önbelleği temizle (geliştirme modunda gerekli olabilir)
const clearContentCache = () => {
  cachedContent = null;
};

// Alt klasörleri bulan fonksiyon - belirli bir dizin için alt dizinleri döndürür
const getSubDirectories = (directory) => {
  const allContent = getAllContent();
  const subdirs = new Set();
  
  // Ana dizin değilse, ilgili içerikleri filtrele
  const contents = allContent.filter(entry => 
    entry.directory !== 'root' && 
    (entry.directory === directory || entry.directory.startsWith(directory + '/'))
  );
  
  // İçeriklerden alt dizinleri çıkar
  contents.forEach(entry => {
    // Ana dizini atlayarak yalnızca alt dizinleri al
    const relativePath = entry.directory.replace(directory + '/', '');
    if (relativePath && relativePath.includes('/')) {
      // İlk alt dizin seviyesini al (ör: 'blog/kategori/js' -> 'kategori')
      const firstLevel = relativePath.split('/')[0];
      subdirs.add(firstLevel);
    }
  });
  
  return Array.from(subdirs).map(subdir => ({
    name: subdir,
    path: `${directory}/${subdir}`,
    title: formatTitle(subdir),
    url: `/${directory}/${subdir}`
  }));
};

// Fonksiyonları dışa aktar
export {
  scanContentDirectory,
  getContentDirectories,
  truncateContent,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories
}; 