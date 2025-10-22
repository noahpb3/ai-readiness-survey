import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Force use of Supabase connection string (env var has wrong value)
const connectionString = 'postgresql://postgres:oIMziLaMpIgojNDK@db.bmsyrncxiohcqwvjzbea.supabase.co:5432/postgres';

console.log('Database connection: Supabase ✓');

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

