import { Pool, QueryResult, QueryResultRow } from '@neondatabase/serverless';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query<T extends QueryResultRow = any>(
    text: string, 
    params?: any[]
): Promise<QueryResult<T>> {
    try {
        return await pool.query<T>(text, params);
    } catch (error) {
        throw error;
    }
}

export async function getClient() {
    return await pool.connect();
}

export default pool;