import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../lib/db';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread') === 'true';

    const cacheKey = getCacheKey('notifications', { 
      userId: user.id, 
      unreadOnly, 
      limit, 
      offset 
    });
    
    const data = await getCached(
      cacheKey,
      async () => {
        // Optimized: Get notifications AND unread count in ONE query using window function
        let queryText = `
          SELECT 
            n.id, n.user_id, n.actor_id, n.type, n.content,
            n.question_id, n.comment_id, n.link,
            n.is_read, n.read_at, n.created_at,
            u.name as actor_name, u.avatar_url as actor_avatar, u.role as actor_role,
            COUNT(*) FILTER (WHERE NOT n.is_read) OVER () as unread_count
          FROM notifications n
          LEFT JOIN users u ON n.actor_id = u.id
          WHERE n.user_id = $1
        `;
        const params: any[] = [user.id];
        let paramIndex = 2;

        if (unreadOnly) {
          queryText += ` AND n.is_read = false`;
        }

        queryText += ` ORDER BY n.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        const unreadCount = result.rows.length > 0 ? parseInt(result.rows[0].unread_count) : 0;

        return {
          notifications: result.rows,
          unreadCount: unreadCount,
          hasMore: result.rows.length === limit
        };
      },
      unreadOnly ? CACHE_TTL.NOTIFICATIONS : 60
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
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await query(
        `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
         WHERE id = $1 AND user_id = $2`,
        [id, user.id]
      );
    } else {
      await query(
        `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 AND is_read = false`,
        [user.id]
      );
    }

    // Get updated unread count with fast query
    const countResult = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [user.id]
    );

    // Invalidate cache for this user
    await invalidateCache(`notifications:{"userId":"${user.id}"*`);

    return NextResponse.json({
      success: true,
      unreadCount: parseInt(countResult.rows[0].count || 0)
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}