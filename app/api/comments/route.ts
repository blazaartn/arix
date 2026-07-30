import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

// GET - Get comments with pagination (optimized)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    const cacheKey = getCacheKey('comments', { questionId, limit, offset });
    
    const data = await getCached(
      cacheKey,
      async () => {
        // ✅ Get reported comment IDs for the current user
        let reportedIds: string[] = [];
        if (session?.user?.id) {
          const reportedResult = await query(
            `SELECT target_id FROM alerts 
             WHERE user_id = $1 AND target_type = 'comment'`,
            [session.user.id]
          );
          reportedIds = reportedResult.rows.map((row: any) => row.target_id);
        }

        // ✅ Build query with filters
        let queryText = `
          SELECT 
            c.id,
            c.content,
            c.user_id,
            c.created_at,
            u.name as author_name,
            u.avatar_url as author_avatar,
            u.role as author_role,
            (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count,
            COALESCE(
              (SELECT json_agg(
                json_build_object(
                  'id', i.id,
                  'image_url', i.image_url
                ) ORDER BY i.upload_order ASC
              ) FROM images i WHERE i.comment_id = c.id),
              '[]'::json
            ) as images
          FROM comments c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.question_id = $1 
            AND c.is_blocked = false
        `;

        const params: any[] = [questionId];
        const conditions: string[] = [];

        // ✅ Exclude comments the user has reported (hide from reporter)
        if (reportedIds.length > 0) {
          const placeholders = reportedIds.map((_, i) => `$${params.length + 1 + i}`).join(',');
          conditions.push(`c.id NOT IN (${placeholders})`);
          params.push(...reportedIds);
        }

        if (conditions.length > 0) {
          queryText += ` AND ${conditions.join(' AND ')}`;
        }

        queryText += ` ORDER BY c.created_at ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // ✅ Get total count (excluding blocked and reported)
        let countQuery = `
          SELECT COUNT(*) as count FROM comments 
          WHERE question_id = $1 AND is_blocked = false
        `;
        const countParams: any[] = [questionId];

        if (reportedIds.length > 0) {
          const placeholders = reportedIds.map((_, i) => `$${countParams.length + 1 + i}`).join(',');
          countQuery += ` AND id NOT IN (${placeholders})`;
          countParams.push(...reportedIds);
        }

        const countResult = await query(countQuery, countParams);

        return {
          comments: result.rows || [],
          total: parseInt(countResult.rows[0]?.count || 0),
          hasMore: result.rows.length === limit
        };
      },
      CACHE_TTL.COMMENTS
    );

    return NextResponse.json({ 
      comments: data.comments,
      total: data.total,
      hasMore: data.hasMore,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ comments: [], total: 0, hasMore: false });
  }
}

// POST - Create comment
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { questionId, content, imageIds } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // ✅ Check if question is blocked
    const questionCheck = await query(
      'SELECT is_blocked FROM questions WHERE id = $1',
      [questionId]
    );
    if (questionCheck.rows.length > 0 && questionCheck.rows[0].is_blocked) {
      return NextResponse.json({ error: 'Cette question est bloquée' }, { status: 403 });
    }

    const result = await query(
      `INSERT INTO comments (user_id, question_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [session.user.id, questionId, content?.trim() || '']
    );

    const comment = result.rows[0];

    if (imageIds && imageIds.length > 0) {
      for (const imageId of imageIds) {
        await query(
          'UPDATE images SET comment_id = $1 WHERE id = $2 AND user_id = $3',
          [comment.id, imageId, session.user.id]
        );
      }
    }

    await addXP(session.user.id, XP_RULES.COMMENT, 'comment', comment.id);

    // Get question owner for notification
    const questionOwner = await query(
      'SELECT user_id, title FROM questions WHERE id = $1',
      [questionId]
    );

    if (questionOwner.rows.length > 0 && questionOwner.rows[0].user_id !== session.user.id) {
      await createNotification({
        userId: questionOwner.rows[0].user_id,
        actorId: session.user.id,
        type: 'comment',
        content: `a commenté votre question "${questionOwner.rows[0].title}"`,
        questionId: questionId,
        commentId: comment.id,
        link: `/questions/${questionId}#comment-${comment.id}`
      });
    }

    // Get author info
    const author = await query(
      'SELECT name, avatar_url FROM users WHERE id = $1',
      [session.user.id]
    );

    // Invalidate only specific question caches
    await invalidateCache(`comments:{"questionId":"${questionId}"}`);
    await invalidateCache(`question:{"id":"${questionId}"}`);

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        author_name: author.rows[0]?.name || 'Anonyme',
        author_avatar: author.rows[0]?.avatar_url || '/default-avatar.png',
        images: []
      }
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du commentaire' }, { status: 500 });
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const comment = await query(
      'SELECT question_id, user_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (comment.rows.length === 0) {
      return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 });
    }

    if (comment.rows[0].user_id !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const questionId = comment.rows[0].question_id;

    // Delete images
    await query('DELETE FROM images WHERE comment_id = $1', [commentId]);
    await query('DELETE FROM likes WHERE comment_id = $1', [commentId]);
    await query('DELETE FROM comments WHERE id = $1', [commentId]);

    // Invalidate only specific question caches
    await invalidateCache(`comments:{"questionId":"${questionId}"}`);
    await invalidateCache(`question:{"id":"${questionId}"}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Commentaire supprimé' 
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}