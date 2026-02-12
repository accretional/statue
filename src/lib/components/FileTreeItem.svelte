<!-- File tree item for project files display -->
<script lang="ts">
  export interface FileTreeItemProps {
    path: string;
    file_name: string;
    directory?: string | null;
    extension?: string | null;
    category?: string | null;
    size?: number;
    last_modified?: string | null;
    git_status?: string | null;
    last_commit?: string | null;
  }

  export let path: string;
  export let file_name: string;
  export let directory: string | null = null;
  export let extension: string | null = null;
  export let category: string | null = null;
  export let size: number = 0;
  export let last_modified: string | null = null;
  export let git_status: string | null = null;
  export let last_commit: string | null = null;

  const GITHUB_BASE = 'https://github.com/accretional/statue';

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function getStatusColor(status: string | null): string {
    switch (status) {
      case 'committed': return '#10b981'; // green
      case 'modified': return '#f59e0b'; // orange
      case 'added': return '#3b82f6'; // blue
      case 'untracked': return '#8b5cf6'; // purple
      case 'deleted': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  }

  function getCategoryIcon(cat: string | null): string {
    switch (cat) {
      case 'content': return '📝';
      case 'code': return '⚙️';
      case 'config': return '🔧';
      case 'style': return '🎨';
      case 'image': return '🖼️';
      case 'database': return '🗄️';
      case 'binary': return '📦';
      default: return '📄';
    }
  }

  function getGitHubFileUrl(filePath: string): string {
    return `${GITHUB_BASE}/blob/main/${filePath}`;
  }

  function getGitHubCommitUrl(commitHash: string): string {
    return `${GITHUB_BASE}/commit/${commitHash}`;
  }
</script>

<div class="file-tree-item">
  <div class="file-main">
    <span class="file-icon">{getCategoryIcon(category)}</span>

    <div class="file-info">
      <div class="file-header">
        <a
          href={getGitHubFileUrl(path)}
          target="_blank"
          rel="noopener noreferrer"
          class="file-name"
        >
          {file_name}
        </a>

        {#if git_status}
          <span
            class="status-badge"
            style="--status-color: {getStatusColor(git_status)}"
          >
            {git_status}
          </span>
        {/if}
      </div>

      <div class="file-meta">
        {#if directory}
          <span class="meta-item">📁 {directory}</span>
        {/if}

        <span class="meta-item">💾 {formatSize(size)}</span>

        {#if last_commit}
          <a
            href={getGitHubCommitUrl(last_commit)}
            target="_blank"
            rel="noopener noreferrer"
            class="meta-item meta-link"
          >
            <code class="commit-hash">{last_commit}</code>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .file-tree-item {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.2s ease;
  }

  .file-tree-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 15%, transparent);
  }

  .file-main {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .file-icon {
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
  }

  .file-info {
    flex: 1;
    min-width: 0;
  }

  .file-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .file-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    transition: color 0.2s ease;
    word-break: break-word;
  }

  .file-name:hover {
    color: var(--color-primary);
  }

  .status-badge {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    background-color: color-mix(in srgb, var(--status-color) 20%, transparent);
    color: var(--status-color);
    white-space: nowrap;
  }

  .file-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--color-muted);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .meta-link {
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .meta-link:hover {
    opacity: 0.7;
  }

  .commit-hash {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    color: var(--color-primary);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .meta-link:hover .commit-hash {
    background-color: color-mix(in srgb, var(--color-primary) 25%, transparent);
  }

  @media (max-width: 640px) {
    .file-main {
      flex-direction: column;
      gap: 8px;
    }

    .file-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
</style>
