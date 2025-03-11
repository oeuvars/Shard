import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Logger } from 'drizzle-orm/logger';

class ConsoleQueryLogger implements Logger {
  logQuery(query: string, params: unknown[]) {
    console.log('Drizzle DB Call:');
    console.log('SQL:', query);
    console.log('Parameters:', params);
    console.log('Timestamp:', new Date().toISOString());
    console.log('------------------');
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
  logger: new ConsoleQueryLogger()
});
