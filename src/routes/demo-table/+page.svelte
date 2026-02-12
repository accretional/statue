<script lang="ts">
  import { Table, SQLite } from 'statue-ssg';

  const columns = ['ID', 'Name', 'Role'];
</script>

<h1>Table Demo (SQLite-backed)</h1>

<div class="table-wrapper">
  <SQLite dbPath="/demo.db" query="SELECT * FROM users" let:columns let:rows>
    <Table {columns} {rows} />
  </SQLite>
</div>

<style>
  .table-wrapper {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
  }
</style>