import { config } from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

config({
  path: resolve(process.cwd(), '../../.env'),
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/database/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true, // tell what things changed
  strict: true, // ask if you want to really make that change
});
