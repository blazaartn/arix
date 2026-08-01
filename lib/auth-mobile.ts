// lib/auth-mobile.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthenticatedUser(req: NextRequest) {
  // 1️⃣ Check for Bearer token (mobile)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Fetch user from DB
      const result = await query(
        'SELECT id, email, name, avatar_url, xp_points, level, role FROM users WHERE id = $1 AND is_active = true',
        [decoded.userId]
      );
      
      if (result.rows.length === 0) return null;
      
      return {
        user: result.rows[0],
        session: null // For compatibility
      };
    } catch {
      return null;
    }
  }

  // 2️⃣ Fallback to NextAuth session (web)
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  return {
    user: session.user,
    session: session
  };
}