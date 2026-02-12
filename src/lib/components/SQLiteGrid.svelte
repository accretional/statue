<script lang="ts">
  import SQLiteMultiDB, { type DatabaseSource } from './SQLiteMultiDB.svelte';

  export interface SQLiteGridProps {
    databases: DatabaseSource[];
    queries: Record<string, string> | string;
    joinConfig?: {
      type: 'LEFT' | 'INNER';
      left: { db: string; key: string };
      right: { db: string; key: string };
    };
    transform?: (data: any[]) => any[];
    columns?: number;
    gap?: string;
  }

  export let databases: DatabaseSource[];
  export let queries: Record<string, string> | string;
  export let joinConfig: { type: 'LEFT' | 'INNER'; left: { db: string; key: string }; right: { db: string; key: string } } | undefined = undefined;
  export let transform: ((data: any[]) => any[]) | undefined = undefined;
  export let columns = 3;
  export let gap = '24px';
</script>

<SQLiteMultiDB {databases} {queries} {joinConfig} {transform} let:data let:columns={dbColumns}>
  <div
    class="sqlite-grid"
    style="--grid-columns: {columns}; --grid-gap: {gap};"
  >
    <slot items={data} columns={dbColumns} />
  </div>
</SQLiteMultiDB>

<style>
  .sqlite-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    gap: var(--grid-gap);
  }

  @media (max-width: 1024px) {
    .sqlite-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .sqlite-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
</style>
