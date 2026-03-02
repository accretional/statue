<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let dbPath: string; // e.g. '/demo.db'
  export let query: string; // e.g. 'SELECT * FROM users'
  export let persist = true;

  let columns: string[] = [];
  let rows: any[] = [];
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
        rows = msg.rows;
      } else {
        error = msg.message;
        console.error('SQLite worker error:', msg.message);
      }
      loading = false;
    };

    worker.onerror = (e: ErrorEvent) => {
      error = e.message ?? 'Worker error';
      console.error('SQLite worker uncaught error:', e);
      loading = false;
    };

    worker.postMessage({
      type: 'query',
      databases: [{ name: 'main', path: dbPath }],
      query,
      persist
    });
  });

  onDestroy(() => {
    worker?.terminate();
  });
</script>

{#if loading}
  <p>Loading data…</p>
{:else if error}
  <p>{error}</p>
{:else}
  <slot {columns} {rows} />
{/if}
