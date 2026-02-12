<script lang="ts">
  import SQLiteMultiDB, { type DatabaseSource } from './SQLiteMultiDB.svelte';
  import type { ComponentType } from 'svelte';

  export interface SQLiteRendererProps {
    databases: DatabaseSource[];
    queries: Record<string, string> | string;
    joinConfig?: {
      type: 'LEFT' | 'INNER';
      left: { db: string; key: string };
      right: { db: string; key: string };
    };
    component: ComponentType;
    propMapping?: Record<string, string | ((row: any) => any)>;
    containerProps?: { columns?: number; gap?: string };
    emptyMessage?: string;
  }

  export let databases: DatabaseSource[];
  export let queries: Record<string, string> | string;
  export let joinConfig: { type: 'LEFT' | 'INNER'; left: { db: string; key: string }; right: { db: string; key: string } } | undefined = undefined;
  export let component: ComponentType;
  export let propMapping: Record<string, string | ((row: any) => any)> | undefined = undefined;
  export let containerProps: { columns?: number; gap?: string } | undefined = undefined;
  export let emptyMessage = 'No results found.';

  const columns = containerProps?.columns || 3;
  const gap = containerProps?.gap || '24px';

  function transformData(data: any[]) {
    if (!propMapping) return data;

    return data.map(row => {
      const mapped: any = {};
      for (const [key, value] of Object.entries(propMapping)) {
        if (typeof value === 'function') {
          mapped[key] = value(row);
        } else if (typeof value === 'string') {
          mapped[key] = row[value];
        }
      }
      return { ...row, ...mapped };
    });
  }
</script>

<SQLiteMultiDB {databases} {queries} {joinConfig} transform={transformData} let:data>
  {#if data && data.length > 0}
    <div
      class="sqlite-renderer-grid"
      style="--grid-columns: {columns}; --grid-gap: {gap};"
    >
      {#each data as item}
        <svelte:component this={component} {...item} />
      {/each}
    </div>
  {:else}
    <div class="sqlite-renderer-empty">
      <p>{emptyMessage}</p>
    </div>
  {/if}
</SQLiteMultiDB>

<style>
  .sqlite-renderer-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    gap: var(--grid-gap);
  }

  @media (max-width: 1024px) {
    .sqlite-renderer-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .sqlite-renderer-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .sqlite-renderer-empty {
    background-color: color-mix(in srgb, var(--color-card) 50%, transparent);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    padding: 48px;
    border-radius: 12px;
    text-align: center;
  }

  .sqlite-renderer-empty p {
    color: var(--color-muted);
    font-size: 15px;
  }
</style>
