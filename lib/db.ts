import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let attempted = false;

/**
 * Returns a Neon Postgres query function, or null if DATABASE_URL is not
 * configured. Callers must fall back to static content when this is null so
 * the site keeps working before a database is wired up.
 */
export function getSql(): Sql | null {
  if (!attempted) {
    attempted = true;
    const url = process.env.DATABASE_URL;
    if (url) {
      sql = neon(url);
    }
  }
  return sql;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
