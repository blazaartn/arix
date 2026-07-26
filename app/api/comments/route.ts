import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

// GET - Get comments with images (optimized)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const cacheKey = getCacheKey('comments', { questionId });
    
    const comments = await getCached(
      cacheKey,
      async () => {
        const result = await query(`
          SELECT 
            c.id,
            c.content,
            c.user_id,
            c.created_at,
            u.name as author_name,
            u.avatar_url as author_avatar,
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
          ORDER BY c.created_at ASC
        `, [questionId]);

        return result.rows || [];
      },
      CACHE_TTL.COMMENTS
    );

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ comments: [] });
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

    // Invalidate caches
    await invalidateCache(`comments:{"questionId":"${questionId}"}`);
    await invalidateCache(`question:{"id":"${questionId}"}`);
    await invalidateCache('questions:*');

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

    // Invalidate caches
    await invalidateCache(`comments:{"questionId":"${questionId}"}`);
    await invalidateCache(`question:{"id":"${questionId}"}`);
    await invalidateCache('questions:*');

    return NextResponse.json({ 
      success: true, 
      message: 'Commentaire supprimé' 
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}