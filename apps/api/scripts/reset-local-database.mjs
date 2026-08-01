import { config } from 'dotenv';
import pg from 'pg';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { Client } = pg;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const rootEnvPath = resolve(currentDirectory, '../../../.env');

config({ path: rootEnvPath });

const environment = process.env.NODE_ENV ?? 'development';
const databaseUrl = process.env.DATABASE_URL;

if (environment === 'staging' || environment === 'production') {
  throw new Error(
    'Database reset refused: this command cannot run in staging or production.',
  );
}

if (!databaseUrl) {
  throw new Error(
    'Database reset failed: DATABASE_URL is missing from the root .env file.',
  );
}

const parsedUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(
  parsedUrl.pathname.replace(/^\/+/, ''),
);

const allowedHosts = new Set(['localhost', '127.0.0.1', '::1']);

if (!allowedHosts.has(parsedUrl.hostname)) {
  throw new Error(
    'Database reset refused: DATABASE_URL must point to a local PostgreSQL server.',
  );
}

if (databaseName !== 'tda_local') {
  throw new Error(
    `Database reset refused: expected "tda_local" but received "${databaseName}".`,
  );
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: false,
});

try {
  await client.connect();

  const result = await client.query(
    'SELECT current_database() AS database_name',
  );

  const connectedDatabase = result.rows[0]?.database_name;

  if (connectedDatabase !== 'tda_local') {
    throw new Error(
      `Database reset refused after connection: connected to "${connectedDatabase}".`,
    );
  }

  await client.query('BEGIN');
  await client.query('DROP SCHEMA public CASCADE');
  await client.query('CREATE SCHEMA public');
  await client.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
  await client.query('COMMIT');

  console.log('Local database "tda_local" reset successfully.');
} catch (error) {
  await client.query('ROLLBACK').catch(() => undefined);
  throw error;
} finally {
  await client.end();
}