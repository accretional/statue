<script lang="ts">
  import { onMount } from 'svelte';
  import { Table } from '$lib';
  import initSqlJs from 'sql.js';

  const columns = ['ID', 'Name', 'Role'];
  let rows: any[][] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Load sql.js
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Fetch the database file
      const res = await fetch('/demo.db');
      const buffer = await res.arrayBuffer();

      // Open database in memory
      const db = new SQL.Database(new Uint8Array(buffer));

      // Run query
      const result = db.exec('SELECT * FROM users');

      // Convert result to rows
      if (result.length > 0) {
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

<h1>Table Demo (SQLite-backed)</h1>

<div class="table-wrapper">
  {#if loading}
    <p>Loading data…</p>
  {:else if error}
    <p>{error}</p>
  {:else}
    <Table {columns} {rows} />
  {/if}
</div>

<style>
  .table-wrapper {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
  }
</style>