import { Pool, QueryResult, QueryResultRow } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  maxUses: 7500,
});

export async function query<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (duration > 300) {
      console.warn(`⚠️ Slow query (${duration}ms):`, text.substring(0, 80) + '...');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    try {
      const client = await pool.connect();
      const result = await client.query<T>(text, params);
      client.release();
      return result;
    } catch (retryError) {
      console.error('❌ Retry failed:', retryError);
      throw error;
    }
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool;