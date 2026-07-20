import { randomUUID } from "node:crypto";
import { getSql } from "./db";

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();
  if (!ready) {
    ready = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS media (
          id uuid PRIMARY KEY,
          url text NOT NULL,
          filename text NOT NULL,
          size integer NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return ready;
}

interface MediaRow {
  id: string;
  url: string;
  filename: string;
  size: number;
  created_at: string;
}

/** Every image ever uploaded through any field's dropzone, newest first. */
export async function getMediaLibrary(): Promise<MediaAsset[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureReady();
  const rows = (await sql`
    SELECT id, url, filename, size, created_at FROM media ORDER BY created_at DESC
  `) as MediaRow[];
  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    filename: row.filename,
    size: row.size,
    createdAt: row.created_at,
  }));
}

export async function addMediaAsset(input: {
  url: string;
  filename: string;
  size: number;
}): Promise<MediaAsset> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  const id = randomUUID();
  await sql`
    INSERT INTO media (id, url, filename, size)
    VALUES (${id}, ${input.url}, ${input.filename}, ${input.size})
  `;
  return {
    id,
    url: input.url,
    filename: input.filename,
    size: input.size,
    createdAt: new Date().toISOString(),
  };
}

/** Deletes the library entry and returns its URL so the caller can also remove the file on disk. */
export async function deleteMediaAsset(id: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  const rows = (await sql`
    DELETE FROM media WHERE id = ${id} RETURNING url
  `) as { url: string }[];
  return rows[0]?.url ?? null;
}
