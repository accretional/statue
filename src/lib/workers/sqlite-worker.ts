import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

interface DatabaseSource {
  name: string;
  path: string;
  remote?: boolean;
}

interface WorkerRequest {
  type: 'query';
  databases: DatabaseSource[];
  query: string;
  persist: boolean;
}

type WorkerResponse =
  | { type: 'result'; columns: string[]; rows: Record<string, any>[] }
  | { type: 'error'; message: string };

/**
 * Load database bytes, reading from the OPFS cache when available.
 * Falls back to a network fetch on cache miss, then writes to OPFS.
 *
 * Uses only the async OPFS API (navigator.storage.getDirectory) which works
 * in Web Workers without COOP/COEP headers or SharedArrayBuffer. SQLite itself
 * runs in-memory — OPFS is used only to cache the raw .db bytes across visits.
 */
async function loadDbBytes(name: string, path: string, persist: boolean): Promise<Uint8Array> {
  const filename = `statue-${name}.db`;

  if (persist) {
    try {
      const root = await navigator.storage.getDirectory();
      const fh = await root.getFileHandle(filename);
      const file = await fh.getFile();
      return new Uint8Array(await file.arrayBuffer());
    } catch {
      // Cache miss — fall through to network fetch
    }
  }

  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch database "${name}": ${res.status} ${res.statusText}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());

  if (persist) {
    try {
      const root = await navigator.storage.getDirectory();
      const fh = await root.getFileHandle(filename, { create: true });
      const writable = await fh.createWritable();
      await writable.write(bytes);
      await writable.close();
    } catch (e) {
      console.warn(`SQLite: could not cache "${name}" in OPFS — caching unavailable.`, e);
    }
  }

  return bytes;
}

function deserializeIntoDb(sqlite3: any, db: any, schema: string, bytes: Uint8Array): void {
  const ptr: number = sqlite3.wasm.allocFromTypedArray(bytes);
  const rc: number = sqlite3.capi.sqlite3_deserialize(
    db.pointer,
    schema,
    ptr,
    bytes.length,
    bytes.length,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
      sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
  );
  if (rc !== 0) {
    sqlite3.wasm.dealloc(ptr);
    throw new Error(`sqlite3_deserialize failed with code ${rc}`);
  }
  // SQLITE_DESERIALIZE_FREEONCLOSE hands ownership of ptr to SQLite
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  try {
    const { databases, query, persist } = e.data;

    if (!databases || databases.length === 0) {
      throw new Error('No databases provided');
    }

    const sqlite3 = await sqlite3InitModule();

    // Load primary DB bytes (from OPFS cache or network) into an in-memory DB
    const primaryBytes = await loadDbBytes(databases[0].name, databases[0].path, persist);
    const primaryDb = new sqlite3.oo1.DB(':memory:');
    deserializeIntoDb(sqlite3, primaryDb, 'main', primaryBytes);

    // ATTACH subsequent databases (each loaded the same way)
    for (const dbSource of databases.slice(1)) {
      const bytes = await loadDbBytes(dbSource.name, dbSource.path, persist);
      primaryDb.exec(`ATTACH DATABASE ':memory:' AS "${dbSource.name}"`);
      deserializeIntoDb(sqlite3, primaryDb, dbSource.name, bytes);
    }

    // Execute the user's query
    const rows: Record<string, any>[] = [];
    let columns: string[] = [];

    primaryDb.exec({
      sql: query,
      rowMode: 'object',
      callback: (row: Record<string, any>) => {
        if (columns.length === 0) columns = Object.keys(row);
        rows.push(row);
      }
    });

    primaryDb.close();

    const response: WorkerResponse = { type: 'result', columns, rows };
    self.postMessage(response);
  } catch (err: any) {
    const response: WorkerResponse = { type: 'error', message: err?.message ?? String(err) };
    self.postMessage(response);
  }
};
