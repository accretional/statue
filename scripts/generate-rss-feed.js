#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default RSS configuration
const DEFAULT_RSS_CONFIG = {
  enabled: true,
  title: null,
  description: null,
  language: 'en-us',
  copyright: null,
  includeDirectories: ['*'],
  excludeDirectories: [],
  maxItems: 50,
  contentMode: 'summary',
  summaryLength: 280,
  includeAuthor: true,
  includeThumbnail: true,
  includeCategories: true,
  pubDateField: 'date',
  itemGuidUsesUrl: true,
  baseUrl: null
};

/**
 * Filter content by directory inclusion/exclusion rules
 */
function filterContentByDirectories(content, includeDirectories, excludeDirectories) {
  return content.filter(item => {
    const itemDir = item.mainDirectory;

    // Exclude first
    if (excludeDirectories.length > 0 && excludeDirectories.includes(itemDir)) {
      return false;
    }

    // If include list is empty or has '*', include all (except excluded)
    if (includeDirectories.length === 0 || includeDirectories.includes('*')) {
      return true;
    }

    // Only include specified directories
    return includeDirectories.includes(itemDir);
  });
}

/**
 * Validate that an item has required fields for RSS
 */
function isValidRSSItem(item, rssConfig) {
  const hasTitle = item.metadata.title;
  const hasDate = item.metadata[rssConfig.pubDateField];

  if (!hasTitle || !hasDate) {
    console.warn(`⚠️  Skipping item without title or date: ${item.url}`);
    return false;
  }

  // Validate date is parseable
  const pubDate = new Date(hasDate);
  if (isNaN(pubDate.getTime())) {
    console.warn(`⚠️  Skipping item with invalid date: ${item.url}`);
    return false;
  }

  return true;
}

/**
 * Sort content by date (newest first)
 */
function sortContentByDate(content, dateField) {
  return content.slice().sort((a, b) => {
    const dateA = new Date(a.metadata[dateField]);
    const dateB = new Date(b.metadata[dateField]);

    // Newest first (descending)
    return dateB - dateA;
  });
}

/**
 * Escape XML special characters
 */
function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Decode basic HTML entities
 */
function decodeHTMLEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'"
  };

  return text.replace(/&[a-z]+;|&#\d+;/gi, match => entities[match] || match);
}

/**
 * Generate summary from HTML content
 */
function generateSummary(htmlContent, maxLength) {
  if (!htmlContent) return '';

  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  const decoded = decodeHTMLEntities(textContent);

  if (decoded.length <= maxLength) {
    return decoded;
  }

  // Truncate at last space before limit
  const truncated = decoded.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

/**
 * Make relative URLs absolute
 */
function makeAbsoluteUrl(url, baseUrl) {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already absolute
  }

  // Remove leading slash if present
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBase}/${cleanUrl}`;
}

/**
 * Generate GUID for an item
 */
function generateGuid(item) {
  // Use URL + date as stable identifier
  return `${item.url}-${item.metadata.date}`;
}

/**
 * Generate RSS XML for a single item
 */
function generateRSSItem(item, rssConfig, baseUrl) {
  const metadata = item.metadata;
  const title = escapeXML(metadata.title);
  const link = `${baseUrl}${item.url}`;
  const guid = rssConfig.itemGuidUsesUrl ? link : generateGuid(item);
  const pubDate = new Date(metadata[rssConfig.pubDateField]).toUTCString();
  const description = escapeXML(metadata.description || '');

  let itemXML = `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="${rssConfig.itemGuidUsesUrl}">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
`;

  // Add author if configured and available
  if (rssConfig.includeAuthor && metadata.author) {
    itemXML += `      <dc:creator>${escapeXML(metadata.author)}</dc:creator>\n`;
  }

  // Add categories if configured and available
  if (rssConfig.includeCategories && metadata.category) {
    const categories = Array.isArray(metadata.category)
      ? metadata.category
      : [metadata.category];
    categories.forEach(cat => {
      itemXML += `      <category>${escapeXML(cat)}</category>\n`;
    });
  }

  // Add content based on contentMode
  if (rssConfig.contentMode === 'full' && item.content) {
    // Include full HTML content
    itemXML += `      <content:encoded><![CDATA[${item.content}]]></content:encoded>\n`;
  } else if (rssConfig.contentMode === 'summary' && item.content) {
    // Generate summary from content
    const summary = generateSummary(item.content, rssConfig.summaryLength);
    if (summary) {
      itemXML += `      <content:encoded><![CDATA[${summary}]]></content:encoded>\n`;
    }
  }
  // If contentMode === 'none', skip content entirely

  // Add thumbnail as media:content if configured and available
  if (rssConfig.includeThumbnail && metadata.thumbnail) {
    const thumbnailUrl = makeAbsoluteUrl(metadata.thumbnail, baseUrl);
    itemXML += `      <media:content url="${thumbnailUrl}" medium="image" />\n`;
  }

  itemXML += `    </item>`;

  return itemXML;
}

/**
 * Generate complete RSS 2.0 XML
 */
function generateRSSXML(items, rssConfig, siteConfig, baseUrl) {
  const title = escapeXML(rssConfig.title || siteConfig.site.name);
  const description = escapeXML(rssConfig.description || siteConfig.site.description);
  const link = baseUrl;
  const language = rssConfig.language;
  const copyright = rssConfig.copyright ||
    `Copyright ${new Date().getFullYear()} ${siteConfig.site.author}`;
  const lastBuildDate = new Date().toUTCString();

  // Build channel elements
  let channelXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${title}</title>
    <link>${link}</link>
    <description>${description}</description>
    <language>${language}</language>
    <copyright>${escapeXML(copyright)}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>Statue SSG</generator>
`;

  // Generate items
  const itemsXML = items.map(item => generateRSSItem(item, rssConfig, baseUrl)).join('\n');

  channelXML += itemsXML;
  channelXML += `
  </channel>
</rss>`;

  return channelXML;
}

/**
 * Main RSS feed generation function
 */
async function generateRSSFeed() {
  try {
    // Load site config from JSON
    const configPath = path.join(__dirname, '..', 'site.config.json');
    if (!fs.existsSync(configPath)) {
      console.log('⚠️  No site.config.json found, skipping RSS feed generation');
      return;
    }
    const siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Merge RSS config with defaults
    const rssConfig = { ...DEFAULT_RSS_CONFIG, ...(siteConfig.rss || {}) };

    // Check if RSS is enabled
    if (!rssConfig.enabled) {
      console.log('RSS feed generation is disabled');
      return;
    }

    console.log('Generating RSS feed...');

    // Validate build directory exists
    const buildDir = path.join(__dirname, '..', 'build');
    if (!fs.existsSync(buildDir)) {
      console.error('❌ Build directory does not exist. Please run "npm run build" first.');
      process.exit(1);
    }

    // Get base URL
    const baseUrl = rssConfig.baseUrl || siteConfig.site.url;
    if (!baseUrl) {
      console.error('❌ No site URL configured. Please set site.url in site.config.js');
      process.exit(1);
    }

    console.log(`🔗 Using site URL: ${baseUrl}`);

    // Import content processor from statue-ssg package
    let getAllContent;
    try {
      const processor = await import('statue-ssg/cms/content-processor.js');
      getAllContent = processor.getAllContent;
    } catch (error) {
      console.log('⚠️  No content found, skipping RSS feed generation');
      return;
    }

    // Load all content
    const allContent = await getAllContent();
    console.log(`Found ${allContent.length} content items`);

    // Filter content by directories
    const filteredContent = filterContentByDirectories(
      allContent,
      rssConfig.includeDirectories,
      rssConfig.excludeDirectories
    );

    if (filteredContent.length > 0) {
      console.log(`✓ Filtered to ${filteredContent.length} items from directories: ${rssConfig.includeDirectories.join(', ')}`);
    } else {
      console.log(`⚠️  No content matches directory filters`);
    }

    // Filter content with valid RSS data (must have date and title)
    const validContent = filteredContent.filter(item => isValidRSSItem(item, rssConfig));

    // Sort by date (newest first)
    const sortedContent = sortContentByDate(validContent, rssConfig.pubDateField);
    console.log('✓ Sorted by date (newest first)');

    // Limit items
    const feedItems = sortedContent.slice(0, rssConfig.maxItems);
    console.log(`✓ Limited to ${feedItems.length} items (max: ${rssConfig.maxItems})`);

    // Generate RSS XML
    const feedXML = generateRSSXML(feedItems, rssConfig, siteConfig, baseUrl);

    // Write to build directory
    const feedPath = path.join(buildDir, 'rss.xml');
    fs.writeFileSync(feedPath, feedXML, 'utf-8');

    console.log('RSS feed generated successfully!');
    console.log(`Feed: ${feedPath}`);
    console.log(`Feed URL: ${baseUrl}/rss.xml`);
    console.log(`Items: ${feedItems.length}`);

  } catch (error) {
    console.error('❌ Error generating RSS feed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

generateRSSFeed();
