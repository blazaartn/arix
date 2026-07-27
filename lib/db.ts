import { Pool, QueryResult, QueryResultRow } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
});

export async function query<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  try {
    const result = await pool.query<T>(text, params);
    // ✅ REMOVE the warning logs entirely
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export default pool;