<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export interface DatabaseSource {
    name: string;
    path: string;
    remote?: boolean;
  }

  export interface SQLiteMultiDBProps {
    databases: DatabaseSource[];
    query: string;
    persist?: boolean;
    transform?: (data: any[]) => any[];
  }

  export let databases: DatabaseSource[];
  export let query: string;
  export let persist = true;
  export let transform: ((data: any[]) => any[]) | undefined = undefined;

  let data: any[] = [];
  let columns: string[] = [];
  let loading = true;
  let error: string | null = null;
  let worker: Worker;

  onMount(() => {
    worker = new Worker(new URL('../workers/sqlite-worker.ts', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === 'result') {
        columns = msg.columns;
        data = transform ? transform(msg.rows) : msg.rows;
      } else {
        error = msg.message;
        console.error('SQLiteMultiDB worker error:', msg.message);
      }
      loading = false;
    };

    worker.onerror = (e: ErrorEvent) => {
      error = e.message ?? 'Worker error';
      console.error('SQLiteMultiDB worker uncaught error:', e);
      loading = false;
    };

    worker.postMessage({ type: 'query', databases, query, persist });
  });

  onDestroy(() => {
    worker?.terminate();
  });
</script>

{#if loading}
  <div class="sqlite-loading">
    <p>Loading data…</p>
  </div>
{:else if error}
  <div class="sqlite-error">
    <p><strong>Error:</strong> {error}</p>
  </div>
{:else}
  <slot {data} {columns} />
{/if}

<style>
  .sqlite-loading,
  .sqlite-error {
    padding: 24px;
    border-radius: 8px;
    text-align: center;
  }

  .sqlite-loading {
    background-color: color-mix(in srgb, var(--color-card) 50%, transparent);
    border: 1px solid var(--color-border);
  }

  .sqlite-loading p {
    color: var(--color-muted);
    font-size: 15px;
  }

  .sqlite-error {
    background-color: color-mix(in srgb, #ff4444 10%, transparent);
    border: 1px solid color-mix(in srgb, #ff4444 30%, transparent);
  }

  .sqlite-error p {
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.6;
  }

  .sqlite-error strong {
    color: #ff4444;
  }
</style>
