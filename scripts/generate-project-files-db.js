#!/usr/bin/env node

/**
 * Generate a SQLite database with all project files and their git status.
 * Useful for helping users understand their project structure and version control status.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glob } from 'glob';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow running from project root or from a user's project directory
const targetDir = process.argv[2] || process.cwd();

/**
 * Get git status for a file
 */
function getGitStatus(filePath, projectRoot) {
  try {
    // Check if file is tracked and its status
    const gitStatus = execSync(`git status --porcelain "${filePath}"`, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'] // Suppress stderr
    }).trim();

    if (!gitStatus) {
      // Empty means committed and unmodified
      return 'committed';
    }

    const statusCode = gitStatus.substring(0, 2).trim();

    // Git status codes
    if (statusCode === '??') return 'untracked';
    if (statusCode === 'M' || statusCode === 'MM' || statusCode === 'AM') return 'modified';
    if (statusCode === 'A') return 'added';
    if (statusCode === 'D') return 'deleted';
    if (statusCode === 'R') return 'renamed';

    return 'modified'; // Default for any other change
  } catch (error) {
    // Not in a git repo or file doesn't exist
    return 'unknown';
  }
}

/**
 * Get last commit info for a file
 */
function getLastCommit(filePath, projectRoot) {
  try {
    const lastCommit = execSync(`git log -1 --format=%H -- "${filePath}"`, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();

    return lastCommit ? lastCommit.substring(0, 8) : null;
  } catch (error) {
    return null;
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
      size: stats.size,
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return {
      lastModified: null,
      size: 0,
      isDirectory: false
    };
  }
}

/**
 * Parse file metadata
 */
async function parseFile(filePath, projectRoot) {
  const relativePath = path.relative(projectRoot, filePath);
  const stats = await getFileStats(filePath);

  if (stats.isDirectory) return null; // Skip directories

  const gitStatus = getGitStatus(filePath, projectRoot);
  const lastCommit = gitStatus === 'committed' ? getLastCommit(filePath, projectRoot) : null;

  const ext = path.extname(relativePath);
  const fileName = path.basename(relativePath);
  const dirName = path.dirname(relativePath);

  // Categorize file type
  let category = 'other';
  if (['.md', '.mdx'].includes(ext)) category = 'content';
  else if (['.svelte', '.ts', '.js', '.jsx', '.tsx'].includes(ext)) category = 'code';
  else if (['.json', '.yaml', '.yml', '.toml'].includes(ext)) category = 'config';
  else if (['.css', '.scss', '.sass'].includes(ext)) category = 'style';
  else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) category = 'image';
  else if (['.db', '.sqlite', '.sqlite3'].includes(ext)) category = 'database';
  else if (['.wasm'].includes(ext)) category = 'binary';

  return {
    path: relativePath,
    fileName,
    directory: dirName === '.' ? '' : dirName,
    extension: ext || '',
    category,
    size: stats.size,
    lastModified: stats.lastModified,
    gitStatus,
    lastCommit
  };
}

/**
 * Find all project files
 */
async function findAllFiles(projectRoot) {
  const files = [];

  // Patterns to exclude
  const excludePatterns = [
    '**/node_modules/**',
    '**/.git/**',
    '**/build/**',
    '**/.svelte-kit/**',
    '**/dist/**',
    '**/.cache/**',
    '**/.temp/**',
    '**/.tmp/**'
  ];

  // Find all files
  const allFiles = await glob('**/*', {
    cwd: projectRoot,
    absolute: true,
    ignore: excludePatterns,
    nodir: true,
    dot: true // Include dotfiles
  });

  for (const filePath of allFiles) {
    const fileData = await parseFile(filePath, projectRoot);
    if (fileData) {
      files.push(fileData);
    }
  }

  return files;
}

/**
 * Create SQLite database with files
 */
async function createDatabase(files, outputPath) {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table
  db.run(`
    CREATE TABLE files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      directory TEXT,
      extension TEXT,
      category TEXT,
      size INTEGER,
      last_modified TEXT,
      git_status TEXT,
      last_commit TEXT
    )
  `);

  // Create index for faster queries
  db.run(`CREATE INDEX idx_directory ON files(directory)`);
  db.run(`CREATE INDEX idx_category ON files(category)`);
  db.run(`CREATE INDEX idx_git_status ON files(git_status)`);

  // Insert files
  const stmt = db.prepare(`
    INSERT INTO files (
      path, file_name, directory, extension, category,
      size, last_modified, git_status, last_commit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const file of files) {
    stmt.run([
      file.path,
      file.fileName,
      file.directory,
      file.extension,
      file.category,
      file.size,
      file.lastModified,
      file.gitStatus,
      file.lastCommit
    ]);
  }

  stmt.free();

  // Export to file
  const data = db.export();
  await fs.writeFile(outputPath, data);

  db.close();

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning project files...');
  console.log(`   Target: ${targetDir}`);

  const files = await findAllFiles(targetDir);
  console.log(`✅ Found ${files.length} files`);

  console.log('📦 Creating SQLite database...');
  const outputPath = path.join(targetDir, 'static', 'project-files.db');

  // Ensure static directory exists
  await fs.mkdir(path.join(targetDir, 'static'), { recursive: true });

  await createDatabase(files, outputPath);

  console.log(`✅ Database created at ${path.relative(targetDir, outputPath)}`);

  // Show breakdown
  console.log('\nFile breakdown:');

  const byCategory = {};
  const byStatus = {};

  files.forEach(f => {
    byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    byStatus[f.gitStatus] = (byStatus[f.gitStatus] || 0) + 1;
  });

  console.log('\n  By category:');
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`    • ${cat}: ${count} files`);
  });

  console.log('\n  By git status:');
  Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    console.log(`    • ${status}: ${count} files`);
  });
}

main().catch(error => {
  console.error('Error generating project files database:', error);
  process.exit(1);
});
