// Content processor for statue-ssg
// Provides metadata and paths - actual rendering happens via mdsvex dynamic imports

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Browser check
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
if (isBrowser) {
  console.error('content-processor.js should only be used on the server side!');
  throw new Error('Content processor cannot run on the client side!');
}

// Try to load site config
let siteConfig = {};
try {
  const configModule = await import('/site.config.js').catch(() => ({ siteConfig: {} }));
  siteConfig = configModule.siteConfig || {};
} catch {
  // siteConfig not available
}

// Process template variables like {{site.name}}, {{contact.email}}
const processTemplateVariables = (content) => {
  const site = siteConfig.site || {};
  const contact = siteConfig.contact || {};
  const social = siteConfig.social || {};
  const legal = siteConfig.legal || {};

  const variables = {
    'site.name': site.name,
    'site.description': site.description,
    'site.url': site.url,
    'site.author': site.author,
    'contact.email': contact.email,
    'contact.privacyEmail': contact.privacyEmail,
    'contact.supportEmail': contact.supportEmail,
    'contact.phone': contact.phone,
    'contact.address.street': contact.address?.street,
    'contact.address.city': contact.address?.city,
    'contact.address.state': contact.address?.state,
    'contact.address.zipCode': contact.address?.zipCode,
    'contact.address.country': contact.address?.country,
    'contact.address.full': contact.address
      ? `${contact.address.street || ''}, ${contact.address.city || ''}, ${contact.address.state || ''} ${contact.address.zipCode || ''}`.trim()
      : '',
    'social.twitter': social.twitter,
    'social.github': social.github,
    'social.linkedin': social.linkedin,
    'social.facebook': social.facebook,
    'social.instagram': social.instagram,
    'social.youtube': social.youtube,
    'social.discord': social.discord,
    'social.reddit': social.reddit,
    'legal.privacyPolicyLastUpdated': legal.privacyPolicyLastUpdated,
    'legal.termsLastUpdated': legal.termsLastUpdated,
    'legal.doNotSell.processingTime': legal.doNotSell?.processingTime,
    'date.now': new Date().toLocaleDateString('en-US'),
    'date.year': new Date().getFullYear().toString(),
    'date.month': new Date().toLocaleDateString('en-US', { month: 'long' }),
    'date.day': new Date().getDate().toString()
  };

  return content.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    if (Object.hasOwn(variables, trimmedName)) {
      return variables[trimmedName] || '';
    }
    return match;
  });
};

// Format title from slug
const formatTitle = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Scan content directory and extract metadata
const scanContentDirectory = async () => {
  const contentPath = path.resolve('content');
  const contentEntries = [];

  if (!fs.existsSync(contentPath)) {
    console.warn('Content folder not found!');
    return contentEntries;
  }

  async function scanDir(dirPath, relativePath = '') {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const entryRelativePath = path.join(relativePath, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        await scanDir(fullPath, entryRelativePath);
      } else if (stats.isFile() && entry.endsWith('.md')) {
        const slug = entry.replace('.md', '');
        const url = relativePath
          ? `/${relativePath}/${slug}`.replace(/\\/g, '/')
          : `/${slug}`;

        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(fileContent);

        // Process metadata through template variables
        const processedMetadata = {};
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') {
            processedMetadata[key] = processTemplateVariables(value);
          } else {
            processedMetadata[key] = value;
          }
        }

        const directory = relativePath.replace(/\\/g, '/');
        const mainDirectory = directory.split('/')[0] || 'root';

        // Import path for dynamic component loading
        const componentPath = `/content/${entryRelativePath.replace(/\\/g, '/')}`;

        contentEntries.push({
          slug,
          path: entryRelativePath,
          url,
          directory,
          mainDirectory,
          depth: directory === '' ? 0 : directory.split('/').length,
          componentPath,
          metadata: {
            title: processedMetadata.title || formatTitle(slug),
            description: processedMetadata.description || '',
            date: processedMetadata.date || null,
            author: processedMetadata.author || null,
            ...processedMetadata
          }
        });
      }
    }
  }

  await scanDir(contentPath);
  return contentEntries;
};

// Get content directories
const getContentDirectories = () => {
  const contentPath = path.resolve('content');
  const directories = [];

  if (!fs.existsSync(contentPath)) {
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

// Cache
let cachedContent = null;

const getAllContent = async () => {
  const isDev = process.env.NODE_ENV === 'development' ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV);

  if (!isDev && cachedContent) return cachedContent;

  const content = await scanContentDirectory();

  if (!isDev) {
    cachedContent = content;
  }

  return content;
};

const getContentByUrl = async (url) => {
  const allContent = await getAllContent();
  const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return allContent.find(entry => {
    const entryUrl = entry.url.endsWith('/') ? entry.url.slice(0, -1) : entry.url;
    return entryUrl === normalizedUrl;
  });
};

const getContentByDirectory = async (directory) => {
  const allContent = await getAllContent();
  if (directory === 'root') {
    return allContent.filter(entry => entry.directory === 'root');
  }
  return allContent.filter(entry =>
    entry.directory === directory || entry.directory.startsWith(directory + '/')
  );
};

const clearContentCache = () => {
  cachedContent = null;
};

const getSubDirectories = async (directory) => {
  const allContent = await getAllContent();
  const subdirs = new Set();

  const contents = allContent.filter(entry =>
    entry.directory !== 'root' &&
    (entry.directory === directory || entry.directory.startsWith(directory + '/'))
  );

  contents.forEach(entry => {
    const relativePath = entry.directory.replace(directory + '/', '');
    if (relativePath && relativePath.includes('/')) {
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

const getSidebarTree = async (directory) => {
  const allContent = await getAllContent();

  const directoryContent = allContent.filter(entry =>
    entry.directory === directory || entry.directory.startsWith(directory + '/')
  );

  const groups = {};

  directoryContent.forEach(entry => {
    const relativePath = entry.directory === directory
      ? ''
      : entry.directory.replace(directory + '/', '');

    const parts = relativePath.split('/').filter(Boolean);
    const groupKey = parts[0] || '_root';

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: groupKey === '_root' ? formatTitle(directory) : formatTitle(groupKey),
        items: []
      };
    }

    groups[groupKey].items.push({
      title: entry.metadata.title,
      url: entry.url,
      order: entry.metadata.order || 999
    });
  });

  Object.values(groups).forEach(group => {
    group.items.sort((a, b) => a.order - b.order);
  });

  const result = [];

  if (groups._root) {
    groups._root.items.forEach(item => {
      result.push(item);
    });
    delete groups._root;
  }

  Object.entries(groups).forEach(([key, group]) => {
    result.push({
      title: group.title,
      children: group.items
    });
  });

  return result;
};

const getAllDirectoriesSidebar = async () => {
  const directories = getContentDirectories();
  const result = [];

  for (const dir of directories) {
    const dirContent = await getSidebarTree(dir.name);
    if (dirContent.length > 0) {
      result.push({
        title: dir.title,
        url: dir.url,
        children: dirContent
      });
    }
  }

  return result;
};

export {
  scanContentDirectory,
  getContentDirectories,
  formatTitle,
  getAllContent,
  getContentByUrl,
  getContentByDirectory,
  clearContentCache,
  getSubDirectories,
  processTemplateVariables,
  getSidebarTree,
  getAllDirectoriesSidebar
};
