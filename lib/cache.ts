import { kv } from '@vercel/kv';

export const CACHE_TTL = {
  QUESTIONS_LIST: 60,
  QUESTION_DETAIL: 300,
  TOP_USERS: 300,
  NOTIFICATIONS: 10,
  SUBJECTS: 3600,
  COMMENTS: 60,
  LIKES: 10,
};

// ✅ Check if KV is configured
const isKvConfigured = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  // Skip cache if KV not configured
  if (!isKvConfigured) {
    return await fetcher();
  }

  try {
    const cached = await kv.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (error) {
    console.warn('Cache read error, falling back to fetch:', error);
  }

  const data = await fetcher();
  
  try {
    await kv.set(key, data, { ex: ttl });
  } catch (error) {
    console.warn('Cache write error:', error);
  }
  
  return data;
}

export async function invalidateCache(pattern: string) {
  if (!isKvConfigured) return;
  
  try {
    const keys = await kv.keys(pattern);
    if (keys.length > 0) {
      await kv.del(...keys);
    }
  } catch (error) {
    console.warn('Cache invalidation error:', error);
  }
}

export function getCacheKey(prefix: string, params: Record<string, any>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);
  
  return `${prefix}:${JSON.stringify(sorted)}`;
}