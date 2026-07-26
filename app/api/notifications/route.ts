import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread') === 'true';

    const cacheKey = getCacheKey('notifications', { 
      userId: session.user.id, 
      unreadOnly, 
      limit, 
      offset 
    });
    
    const data = await getCached(
      cacheKey,
      async () => {
        let queryText = `
          SELECT 
            n.id, n.user_id, n.actor_id, n.type, n.content,
            n.question_id, n.comment_id, n.link,
            n.is_read, n.read_at, n.created_at,
            u.name as actor_name, u.avatar_url as actor_avatar, u.role as actor_role
          FROM notifications n
          LEFT JOIN users u ON n.actor_id = u.id
          WHERE n.user_id = $1
        `;
        const params: any[] = [session.user.id];
        let paramIndex = 2;

        if (unreadOnly) {
          queryText += ` AND n.is_read = false`;
        }

        queryText += ` ORDER BY n.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        const countResult = await query(
          'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
          [session.user.id]
        );

        return {
          notifications: result.rows,
          unreadCount: parseInt(countResult.rows[0].count),
          hasMore: result.rows.length === limit
        };
      },
      unreadOnly ? CACHE_TTL.NOTIFICATIONS : 30 // shorter cache for read notifications
    );

    return NextResponse.json({
      success: true,
      ...data,
      pagination: {
        limit,
        offset,
        hasMore: data.hasMore
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await query(
        `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
         WHERE id = $1 AND user_id = $2`,
        [id, session.user.id]
      );
    } else {
      await query(
        `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 AND is_read = false`,
        [session.user.id]
      );
    }

    const countResult = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [session.user.id]
    );

    // Invalidate cache
    await invalidateCache(`notifications:*"userId":"${session.user.id}"*`);

    return NextResponse.json({
      success: true,
      unreadCount: parseInt(countResult.rows[0].count)
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}