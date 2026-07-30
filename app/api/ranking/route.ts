import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // ✅ Max 50
    const offset = parseInt(searchParams.get('offset') || '0');

    // ✅ OPTIMIZED: Use denormalized user_rank column (no counting needed)
    const result = await query(`
      SELECT 
        id,
        name,
        avatar_url,
        xp_points,
        level,
        role,
        user_rank as rank
      FROM users
      WHERE xp_points > 0 AND is_active = true
      ORDER BY xp_points DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // ✅ Simple count query using index (very fast)
    const countResult = await query(
      'SELECT COUNT(*) as count FROM users WHERE xp_points > 0 AND is_active = true'
    );

    // ✅ Get user rank from denormalized column (instant lookup, no counting)
    const session = await getServerSession(authOptions);
    let userRank = null;
    if (session && session.user?.id) {
      const userRankResult = await query(`
        SELECT user_rank
        FROM users
        WHERE id = $1
      `, [session.user.id]);
      
      if (userRankResult.rows.length > 0) {
        userRank = userRankResult.rows[0].user_rank;
      }
    }

    return NextResponse.json({
      success: true,
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      userRank: userRank,
      hasMore: result.rows.length === limit
    });

  } catch (error) {
    console.error('Error fetching ranking:', error);
    // ✅ Return empty on error (don't fail)
    return NextResponse.json({
      success: true,
      users: [],
      total: 0,
      userRank: null,
      hasMore: false
    });
  }
}
