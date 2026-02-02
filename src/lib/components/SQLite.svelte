<script lang="ts">
  import { onMount } from 'svelte';
  import initSqlJs from 'sql.js';

  export let dbPath: string; // e.g. '/demo.db'
  export let query: string; // e.g. 'SELECT * FROM users'

  let columns: string[] = [];
  let rows: any[][] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      const res = await fetch(dbPath);
      const buffer = await res.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));

      const result = db.exec(query);
      if (result.length > 0) {
        columns = result[0].columns;
        rows = result[0].values;
      }
    } catch (e) {
      error = 'Failed to load database';
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading data…</p>
{:else if error}
  <p>{error}</p>
{:else}
  <slot {columns} {rows} />
{/if}
