import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// Content klasöründeki tüm alt dizinleri otomatik tespit eden fonksiyon
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

// Slug'dan başlık formatı oluşturan yardımcı fonksiyon
function formatTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Markdown içeriği işleyen fonksiyon
function processMarkdown(content) {
  return marked.parse(content);
}

// Tüm sayfa gruplarını yükleyen fonksiyon
export async function loadPageGroups() {
  // Content dizinlerini tespit et
  const contentDirs = detectContentDirectories();
  
  // Her dizin için bir sayfa grubu oluştur
  const pageGroups = contentDirs.map(dir => ({
    name: dir.name,
    title: dir.title,
    sourceDir: dir.path,
    outputDir: dir.outputDir,
    listable: true,
    hierarchical: dir.name === 'docs', // Docs için hiyerarşik görünüm aktif
    pages: []
  }));
  
  // Her sayfa grubu için içeriği yükle
  for (const pageGroup of pageGroups) {
    await loadPagesForGroup(pageGroup);
  }
  
  // Navbar öğelerini oluştur
  const navbarItems = contentDirs.map(dir => ({
    title: dir.title,
    url: `/${dir.outputDir}`
  }));
  
  return {
    pageGroups,
    navbarItems
  };
}

// Bir sayfa grubu için tüm sayfaları yükleyen fonksiyon
async function loadPagesForGroup(pageGroup) {
  const sourceDir = path.resolve(pageGroup.sourceDir);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Kaynak dizin ${sourceDir} (${pageGroup.name} sayfa grubu) bulunamadı.`);
    return;
  }
  
  const files = getAllFiles(sourceDir);
  
  for (const file of files) {
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
  }
}

// Bir dizindeki tüm dosyaları listeyen yardımcı fonksiyon
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

// Belirli bir sayfa grubundaki bir sayfayı yükleyen fonksiyon
export async function loadPageBySlug(groupName, slug) {
  const { pageGroups } = await loadPageGroups();
  const pageGroup = pageGroups.find(group => group.name === groupName);
  
  if (!pageGroup) {
    return null;
  }
  
  const page = pageGroup.pages.find(p => p.slug === slug);
  return page;
}

// Bir sayfa grubundaki tüm sayfaları yükleyen fonksiyon
export async function loadPageGroup(groupName) {
  const { pageGroups, navbarItems } = await loadPageGroups();
  const pageGroup = pageGroups.find(group => group.name === groupName);
  
  if (!pageGroup) {
    return null;
  }
  
  // Hiyerarşik görünüm için sayfaları organize et
  const organizedPages = {};
  
  if (pageGroup.hierarchical) {
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
  
  return {
    pageGroup,
    navbarItems,
    organizedPages: Object.values(organizedPages)
  };
} 