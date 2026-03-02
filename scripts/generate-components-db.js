#!/usr/bin/env node

/**
 * Generate a SQLite database with metadata about all Svelte components
 * in the Statue project and templates.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glob } from 'glob';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

/**
 * Get git information for a file
 */
function getGitInfo(filePath) {
  try {
    // Get last commit hash for this file
    const lastCommit = execSync(`git log -1 --format=%H -- "${filePath}"`, {
      cwd: projectRoot,
      encoding: 'utf8'
    }).trim();

    // Check if file has uncommitted changes
    const gitStatus = execSync(`git status --porcelain "${filePath}"`, {
      cwd: projectRoot,
      encoding: 'utf8'
    }).trim();

    const isModified = gitStatus.length > 0;

    return {
      lastCommit: lastCommit || null,
      isModified
    };
  } catch (error) {
    return {
      lastCommit: null,
      isModified: false
    };
  }
}

/**
 * Get file stats
 */
async function getFileStats(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      lastModified: stats.mtime.toISOString(),
      size: stats.size
    };
  } catch (error) {
    return {
      lastModified: null,
      size: 0
    };
  }
}

/**
 * Parse component name from file path
 */
function getComponentName(filePath) {
  return path.basename(filePath, '.svelte');
}

/**
 * Read component file and extract metadata
 */
async function parseComponent(filePath, template = null) {
  const relativePath = path.relative(projectRoot, filePath);
  const componentName = getComponentName(filePath);
  const stats = await getFileStats(filePath);
  const gitInfo = getGitInfo(filePath);

  // Read file content to get description from comments
  let description = null;
  try {
    const content = await fs.readFile(filePath, 'utf8');

    // Look for JSDoc-style description in the file
    const descMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n/);
    if (descMatch) {
      description = descMatch[1].trim();
    } else {
      // Look for single-line comment at top
      const commentMatch = content.match(/^<!--\s*(.+?)\s*-->/);
      if (commentMatch) {
        description = commentMatch[1].trim();
      }
    }
  } catch (error) {
    // Ignore read errors
  }

  return {
    name: componentName,
    template,
    path: relativePath,
    description,
    lastModified: stats.lastModified,
    size: stats.size,
    lastCommit: gitInfo.lastCommit?.substring(0, 8) || null, // Short hash
    isModified: gitInfo.isModified ? 1 : 0
  };
}

/**
 * Find all component files
 */
async function findAllComponents() {
  const components = [];

  // Main library components
  const mainComponents = await glob('src/lib/components/**/*.svelte', {
    cwd: projectRoot,
    absolute: true
  });

  for (const filePath of mainComponents) {
    const component = await parseComponent(filePath, null);
    components.push(component);
  }

  // Template components
  const templatesDir = path.join(projectRoot, 'templates');
  try {
    const templates = await fs.readdir(templatesDir);

    for (const template of templates) {
      const templatePath = path.join(templatesDir, template);
      const stat = await fs.stat(templatePath);

      if (!stat.isDirectory()) continue;

      // Find components in this template
      const templateComponents = await glob('src/lib/components/**/*.svelte', {
        cwd: templatePath,
        absolute: true
      });

      for (const filePath of templateComponents) {
        const component = await parseComponent(filePath, template);
        components.push(component);
      }
    }
  } catch (error) {
    console.warn('No templates directory found or error reading templates');
  }

  return components;
}

/**
 * Create SQLite database with components
 */
async function createDatabase(components) {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table
  db.run(`
    CREATE TABLE components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      template TEXT,
      path TEXT NOT NULL,
      description TEXT,
      last_modified TEXT,
      size INTEGER,
      last_commit TEXT,
      is_modified INTEGER DEFAULT 0
    )
  `);

  // Insert components
  const stmt = db.prepare(`
    INSERT INTO components (
      name, template, path, description, last_modified, size, last_commit, is_modified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const component of components) {
    stmt.run([
      component.name,
      component.template,
      component.path,
      component.description,
      component.lastModified,
      component.size,
      component.lastCommit,
      component.isModified
    ]);
  }

  stmt.free();

  // Export to file
  const data = db.export();
  const outputPath = path.join(projectRoot, 'static', 'components.db');
  await fs.writeFile(outputPath, data);

  db.close();

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for Svelte components...');

  const components = await findAllComponents();
  console.log(`✅ Found ${components.length} components`);

  console.log('📦 Creating SQLite database...');
  const dbPath = await createDatabase(components);

  console.log(`✅ Database created at ${path.relative(projectRoot, dbPath)}`);
  console.log('\nComponent breakdown:');

  const mainCount = components.filter(c => !c.template).length;
  const templateCount = components.filter(c => c.template).length;

  console.log(`  - Main library: ${mainCount} components`);
  console.log(`  - Templates: ${templateCount} components`);

  // Group by template
  const byTemplate = {};
  components.forEach(c => {
    if (c.template) {
      byTemplate[c.template] = (byTemplate[c.template] || 0) + 1;
    }
  });

  Object.entries(byTemplate).forEach(([template, count]) => {
    console.log(`    • ${template}: ${count} components`);
  });
}

main().catch(error => {
  console.error('Error generating components database:', error);
  process.exit(1);
});
