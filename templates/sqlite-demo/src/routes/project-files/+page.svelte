<script lang="ts">
  import SQLiteMultiDB from 'statue-ssg/components/SQLiteMultiDB.svelte';
import FileTreeItem from 'statue-ssg/components/FileTreeItem.svelte';

  // Query to get all files, organized by directory
  const query = `
    SELECT
      path,
      file_name,
      directory,
      extension,
      category,
      size,
      last_modified,
      git_status,
      last_commit
    FROM files
    ORDER BY
      directory,
      CASE category
        WHEN 'config' THEN 1
        WHEN 'content' THEN 2
        WHEN 'code' THEN 3
        WHEN 'style' THEN 4
        WHEN 'image' THEN 5
        WHEN 'database' THEN 6
        ELSE 7
      END,
      file_name
  `;

  // Stats query
  const statsQuery = `
    SELECT
      COUNT(*) as total_files,
      SUM(size) as total_size,
      SUM(CASE WHEN git_status = 'committed' THEN 1 ELSE 0 END) as committed,
      SUM(CASE WHEN git_status = 'modified' THEN 1 ELSE 0 END) as modified,
      SUM(CASE WHEN git_status = 'untracked' THEN 1 ELSE 0 END) as untracked,
      SUM(CASE WHEN git_status = 'added' THEN 1 ELSE 0 END) as added
    FROM files
  `;

  // Category breakdown query
  const categoryQuery = `
    SELECT
      category,
      COUNT(*) as count,
      SUM(size) as total_size
    FROM files
    GROUP BY category
    ORDER BY count DESC
  `;

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<svelte:head>
  <title>Project Files - Statue SSG</title>
  <meta name="description" content="Browse all files in your Statue project with git status tracking" />
</svelte:head>

<div class="project-files-page">
  <header>
    <nav class="breadcrumb">
      <a href="/">← Back to Demos</a>
    </nav>
    <h1>Project Files</h1>
    <p class="subtitle">
      Complete file listing with version control status. This helps you understand your
      project structure and track changes—especially useful if you're new to git.
    </p>
  </header>

  <!-- Statistics -->
  <SQLiteMultiDB
    databases={[{ name: 'files', path: '/project-files.db' }]}
    query={statsQuery}
    let:data
  >
    {#if data && data[0]}
      {@const stats = data[0]}
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{stats.total_files}</div>
          <div class="stat-label">Total Files</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{formatSize(stats.total_size)}</div>
          <div class="stat-label">Total Size</div>
        </div>

        <div class="stat-card stat-committed">
          <div class="stat-value">{stats.committed}</div>
          <div class="stat-label">Committed</div>
        </div>

        <div class="stat-card stat-modified">
          <div class="stat-value">{stats.modified}</div>
          <div class="stat-label">Modified</div>
        </div>

        <div class="stat-card stat-untracked">
          <div class="stat-value">{stats.untracked}</div>
          <div class="stat-label">Untracked</div>
        </div>

        <div class="stat-card stat-added">
          <div class="stat-value">{stats.added}</div>
          <div class="stat-label">Added</div>
        </div>
      </div>
    {/if}
  </SQLiteMultiDB>

  <!-- Category Breakdown -->
  <section class="section">
    <h2>File Categories</h2>
    <SQLiteMultiDB
      databases={[{ name: 'files', path: '/project-files.db' }]}
      query={categoryQuery}
      let:data
    >
      <div class="category-grid">
        {#each data as cat}
          <div class="category-card">
            <div class="category-info">
              <span class="category-name">{cat.category}</span>
              <span class="category-count">{cat.count} files</span>
            </div>
            <div class="category-size">{formatSize(cat.total_size)}</div>
          </div>
        {/each}
      </div>
    </SQLiteMultiDB>
  </section>

  <!-- File List -->
  <section class="section">
    <h2>All Files</h2>
    <SQLiteMultiDB
      databases={[{ name: 'files', path: '/project-files.db' }]}
      query={query}
      let:data
    >
      <div class="file-list">
        {#each data as file}
          <FileTreeItem {...file} />
        {/each}
      </div>
    </SQLiteMultiDB>
  </section>

  <footer class="page-footer">
    <p>
      💡 <strong>What is this?</strong> This page shows all files in your Statue project
      along with their version control status. Files are categorized and color-coded by
      git status (committed, modified, untracked, etc.).
    </p>
    <p>
      <strong>Git Status Guide:</strong>
    </p>
    <ul>
      <li><strong>Committed</strong> - File is saved in git history</li>
      <li><strong>Modified</strong> - File has unsaved changes</li>
      <li><strong>Untracked</strong> - New file not yet added to git</li>
      <li><strong>Added</strong> - New file staged for next commit</li>
    </ul>
    <p>
      To regenerate this database, run: <code>npm run generate:project-files-db</code>
    </p>
  </footer>
</div>

<style>
  .project-files-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  header {
    text-align: center;
    margin-bottom: 48px;
  }

  .breadcrumb {
    margin-bottom: 24px;
  }

  .breadcrumb a {
    display: inline-block;
    color: var(--color-muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .breadcrumb a:hover {
    color: var(--color-primary);
  }

  h1 {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 18px;
    color: var(--color-muted);
    margin: 0;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }

  .stat-card {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 15%, transparent);
  }

  .stat-committed {
    border-color: color-mix(in srgb, #10b981 30%, transparent);
  }

  .stat-modified {
    border-color: color-mix(in srgb, #f59e0b 30%, transparent);
  }

  .stat-untracked {
    border-color: color-mix(in srgb, #8b5cf6 30%, transparent);
  }

  .stat-added {
    border-color: color-mix(in srgb, #3b82f6 30%, transparent);
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: var(--color-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section {
    margin-bottom: 60px;
  }

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 24px 0;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .category-card {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
  }

  .category-card:hover {
    border-color: var(--color-primary);
  }

  .category-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .category-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
    text-transform: capitalize;
  }

  .category-count {
    font-size: 13px;
    color: var(--color-muted);
  }

  .category-size {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
  }

  .file-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .page-footer {
    margin-top: 80px;
    padding: 32px;
    background-color: color-mix(in srgb, var(--color-card) 50%, transparent);
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  .page-footer p {
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.8;
    margin: 0 0 12px 0;
  }

  .page-footer p:last-child {
    margin-bottom: 0;
  }

  .page-footer ul {
    margin: 12px 0;
    padding-left: 24px;
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.8;
  }

  .page-footer code {
    background-color: color-mix(in srgb, var(--color-text) 10%, transparent);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px;
    }

    .subtitle {
      font-size: 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .section {
      margin-bottom: 48px;
    }

    .page-footer {
      margin-top: 60px;
      padding: 24px;
    }
  }
</style>
