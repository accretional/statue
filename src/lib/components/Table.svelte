<script lang="ts">
  export let columns: string[] = [];
  export let rows: any[][] = [];
</script>

<table class="table">
  <thead>
    <tr>
      {#each columns as col}
        <th>{col}</th>
      {/each}
    </tr>
  </thead>

  <tbody>
  {#if rows.length === 0}
    <tr>
      <td colspan={columns.length} class="empty">
        No data available
      </td>
    </tr>
  {:else}
    {#each rows as row}
      <tr>
        {#each row as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
  {/if}
</tbody>
</table>

<style>
  .table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-card);
    border-radius: 8px;
    overflow: hidden;
    font-size: 0.95rem;
  }

  thead {
    background: var(--color-muted);
  }

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
  }

  tbody tr:hover {
    background: var(--color-hover);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
  .empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-muted-text);
}
</style>