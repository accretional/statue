<!-- Component information card -->
<script lang="ts">
  export interface ComponentInfoProps {
    name: string;
    template?: string | null;
    path: string;
    description?: string | null;
    last_modified?: string | null;
    size?: number;
    last_commit?: string | null;
    is_modified?: number;
  }

  export let name: string;
  export let template: string | null = null;
  export let path: string;
  export let description: string | null = null;
  export let last_modified: string | null = null;
  export let size: number = 0;
  export let last_commit: string | null = null;
  export let is_modified: number = 0;

  const GITHUB_BASE = 'https://github.com/accretional/statue';

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatDate(isoDate: string | null): string {
    if (!isoDate) return 'Unknown';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getGitHubFileUrl(filePath: string): string {
    return `${GITHUB_BASE}/blob/main/${filePath}`;
  }

  function getGitHubCommitUrl(commitHash: string): string {
    return `${GITHUB_BASE}/commit/${commitHash}`;
  }
</script>

<div class="component-card">
  <div class="component-header">
    <h3 class="component-name">{name}</h3>
    {#if template}
      <span class="component-template">{template}</span>
    {:else}
      <span class="component-core">Core</span>
    {/if}
  </div>

  {#if description}
    <p class="component-description">{description}</p>
  {/if}

  <div class="component-meta">
    <div class="meta-item">
      <span class="meta-label">Path:</span>
      <a
        href={getGitHubFileUrl(path)}
        target="_blank"
        rel="noopener noreferrer"
        class="meta-link"
      >
        <code class="meta-value meta-code-link">{path}</code>
      </a>
    </div>

    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">Size:</span>
        <span class="meta-value">{formatSize(size)}</span>
      </div>

      <div class="meta-item">
        <span class="meta-label">Modified:</span>
        <span class="meta-value">{formatDate(last_modified)}</span>
      </div>
    </div>

    {#if last_commit}
      <div class="meta-row">
        <div class="meta-item">
          <span class="meta-label">Commit:</span>
          <a
            href={getGitHubCommitUrl(last_commit)}
            target="_blank"
            rel="noopener noreferrer"
            class="meta-link"
          >
            <code class="meta-value meta-commit meta-code-link">{last_commit}</code>
          </a>
        </div>

        {#if is_modified}
          <span class="meta-badge meta-modified">Modified</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .component-card {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .component-card:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  .component-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .component-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  }

  .component-template,
  .component-core {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .component-template {
    background-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
    color: var(--color-primary);
  }

  .component-core {
    background-color: color-mix(in srgb, #10b981 20%, transparent);
    color: #10b981;
  }

  .component-description {
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }

  .component-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--color-border);
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }

  .meta-label {
    color: var(--color-muted);
    font-weight: 500;
  }

  .meta-value {
    color: var(--color-text);
  }

  code.meta-value {
    background-color: color-mix(in srgb, var(--color-text) 8%, transparent);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  }

  .meta-link {
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .meta-link:hover {
    opacity: 0.7;
  }

  .meta-link:hover .meta-code-link {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  }

  .meta-commit {
    color: var(--color-primary);
  }

  .meta-code-link {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .meta-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .meta-modified {
    background-color: color-mix(in srgb, #f59e0b 20%, transparent);
    color: #f59e0b;
  }

  @media (max-width: 640px) {
    .component-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .meta-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>
