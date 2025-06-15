import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
    throw new Error(
      `DATABASE_URL is not defined in file ${__filename}`,
    );
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: '_drizzle_migrations',
    schema: 'public',
  },
  verbose: true,
  strict: true,
});
