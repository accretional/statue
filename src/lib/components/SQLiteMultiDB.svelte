<script lang="ts">
  import { onMount } from 'svelte';
  import initSqlJs from 'sql.js/dist/sql-wasm.js';
  import type { Database } from 'sql.js';

  export interface DatabaseSource {
    name: string;
    path: string;
    remote?: boolean;
  }

  export interface SQLiteMultiDBProps {
    databases: DatabaseSource[];
    queries: Record<string, string> | string; // Map of db name to query, or single query
    joinConfig?: {
      type: 'LEFT' | 'INNER';
      left: { db: string; key: string };
      right: { db: string; key: string };
    };
    transform?: (data: any[]) => any[];
  }

  export let databases: DatabaseSource[];
  export let queries: Record<string, string> | string;
  export let joinConfig: { type: 'LEFT' | 'INNER'; left: { db: string; key: string }; right: { db: string; key: string } } | undefined = undefined;
  export let transform: ((data: any[]) => any[]) | undefined = undefined;

  let data: any[] = [];
  let columns: string[] = [];
  let loading = true;
  let error: string | null = null;

  function performJoin(
    leftData: any[],
    rightData: any[],
    leftKey: string,
    rightKey: string,
    joinType: 'LEFT' | 'INNER'
  ): any[] {
    // Create a lookup map for the right dataset
    const rightMap = new Map<any, any[]>();
    rightData.forEach(row => {
      const key = row[rightKey];
      if (!rightMap.has(key)) {
        rightMap.set(key, []);
      }
      rightMap.get(key)!.push(row);
    });

    const results: any[] = [];

    leftData.forEach(leftRow => {
      const key = leftRow[leftKey];
      const matches = rightMap.get(key) || [];

      if (matches.length > 0) {
        // Join matching rows
        matches.forEach(rightRow => {
          results.push({ ...leftRow, ...rightRow });
        });
      } else if (joinType === 'LEFT') {
        // LEFT JOIN: include row even without match
        results.push({ ...leftRow });
      }
      // INNER JOIN: skip rows without matches
    });

    return results;
  }

  function rowsToObjects(rows: any[][], columns: string[]): any[] {
    return rows.map(row => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }

  onMount(async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/${file}`
      });

      const dbInstances = await Promise.all(
        databases.map(async (dbSource) => {
          try {
            const res = await fetch(dbSource.path);
            if (!res.ok) {
              throw new Error(`Failed to load database "${dbSource.name}": ${res.status} ${res.statusText}`);
            }
            const buffer = await res.arrayBuffer();
            const db = new SQL.Database(new Uint8Array(buffer));
            return { name: dbSource.name, db };
          } catch (e: any) {
            if (e.message?.includes('CORS')) {
              throw new Error(`CORS error loading "${dbSource.name}". Ensure the database URL has proper Access-Control-Allow-Origin headers.`);
            }
            throw new Error(`Failed to load database "${dbSource.name}": ${e.message}`);
          }
        })
      );

      if (dbInstances.length === 0) {
        throw new Error('No databases provided');
      }

      if (typeof queries === 'string') {
        const result = dbInstances[0].db.exec(queries);
        if (result.length > 0) {
          columns = result[0].columns;
          data = rowsToObjects(result[0].values, columns);
        }
      } else if (joinConfig && databases.length >= 2) {
        const leftDbName = joinConfig.left.db;
        const rightDbName = joinConfig.right.db;

        const leftDb = dbInstances.find(d => d.name === leftDbName);
        const rightDb = dbInstances.find(d => d.name === rightDbName);

        if (!leftDb || !rightDb) {
          throw new Error(`Databases "${leftDbName}" or "${rightDbName}" not found`);
        }

        const leftQuery = queries[leftDbName];
        const rightQuery = queries[rightDbName];

        if (!leftQuery || !rightQuery) {
          throw new Error(`Queries for "${leftDbName}" or "${rightDbName}" not specified`);
        }

        const leftResult = leftDb.db.exec(leftQuery);
        const rightResult = rightDb.db.exec(rightQuery);

        if (leftResult.length === 0) {
          // No left data, return empty
          data = [];
        } else {
          const leftData = rowsToObjects(leftResult[0].values, leftResult[0].columns);
          const rightData = rightResult.length > 0
            ? rowsToObjects(rightResult[0].values, rightResult[0].columns)
            : [];

          data = performJoin(
            leftData,
            rightData,
            joinConfig.left.key,
            joinConfig.right.key,
            joinConfig.type
          );

          const leftCols = new Set(leftResult[0].columns);
          const rightCols = rightResult.length > 0 ? rightResult[0].columns : [];
          columns = [...leftResult[0].columns, ...rightCols.filter(c => !leftCols.has(c))];
        }
      } else {
        throw new Error('Invalid query configuration. Provide either a single query string or multiple queries with joinConfig.');
      }

      if (transform && data.length > 0) {
        data = transform(data);
      }

      dbInstances.forEach(({ db }) => db.close());
    } catch (e: any) {
      error = e.message || 'Failed to load databases';
      console.error('SQLiteMultiDB error:', e);
    } finally {
      loading = false;
    }
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
