import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Logger } from 'drizzle-orm/logger';
import { colors } from '@/constants';

class ConsoleQueryLogger implements Logger {
  logQuery(query: string, params: unknown[]) {
    console.log(`${colors.bright}${colors.blue}Drizzle DB Call:${colors.reset}`);
    console.log(`${colors.yellow}Parameters:${colors.reset}`, params);
    console.log(`${colors.magenta}Timestamp:${colors.reset} ${new Date().toISOString()}`);
    console.log(`${colors.dim}------------------${colors.reset}`);
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
  logger: new ConsoleQueryLogger()
});
