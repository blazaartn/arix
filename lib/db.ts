import { Pool, QueryResult, QueryResultRow } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Reduce max connections to avoid timeouts
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000, // 3 seconds timeout
  maxUses: 7500, // Close connections after 7500 uses
});

export async function query<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries
    if (duration > 100) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    // Try one more time with a new connection
    try {
      const client = await pool.connect();
      const result = await client.query<T>(text, params);
      client.release();
      return result;
    } catch (retryError) {
      console.error('Database retry failed:', retryError);
      throw error;
    }
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool;