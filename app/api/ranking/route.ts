import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get current user for highlighting
        const session = await getServerSession(authOptions);

        // Get top users with rank
        const result = await query(`
            WITH ranked_users AS (
                SELECT 
                    id,
                    name,
                    avatar_url,
                    xp_points,
                    level,
                    role,
                    ROW_NUMBER() OVER (ORDER BY xp_points DESC) as rank_position
                FROM users
                WHERE xp_points > 0
            )
            SELECT * FROM ranked_users
            ORDER BY rank_position ASC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        // Get total count
        const countResult = await query(
            'SELECT COUNT(*) as count FROM users WHERE xp_points > 0'
        );

        // Get current user's rank if logged in
        let userRank = null;
        if (session) {
            const userRankResult = await query(`
                WITH ranked_users AS (
                    SELECT 
                        id,
                        ROW_NUMBER() OVER (ORDER BY xp_points DESC) as rank_position
                    FROM users
                    WHERE xp_points > 0
                )
                SELECT rank_position FROM ranked_users WHERE id = $1
            `, [session.user.id]);
            
            if (userRankResult.rows.length > 0) {
                userRank = parseInt(userRankResult.rows[0].rank_position);
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
        return NextResponse.json(
            { error: 'Erreur lors du chargement du classement' },
            { status: 500 }
        );
    }
}