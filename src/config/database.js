import 'dotenv/config';
import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-serverless';

// Initialize the Neon client with the configuration
const sql = neon(process.env.DATABASE_URL);
// Initiallize Drizzle ORM with the Neon client
const db = drizzle(sql);
// Export db and sql for use in other parts of the application
export {db, sql};