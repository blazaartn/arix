import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../../lib/db';
import { invalidateCache } from '../../../../lib/cache';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const { commentId } = await request.json();
    if (!commentId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Check if comment exists
    const comment = await query(
      'SELECT id, question_id FROM comments WHERE id = $1',
      [commentId]
    );
    if (comment.rows.length === 0) {
      return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 });
    }

    const existing = await query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND comment_id = $2 LIMIT 1',
      [user.id, commentId]
    );

    let liked = false;

    if (existing.rows.length > 0) {
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
        [user.id, commentId]
      );
      liked = false;
    } else {
      await query(
        'INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)',
        [user.id, commentId]
      );
      liked = true;
    }

    // Invalidate caches
    const questionId = comment.rows[0].question_id;
    await invalidateCache(`comments:{"questionId":"${questionId}"}`);
    await invalidateCache(`question:{"id":"${questionId}"}`);

    return NextResponse.json({ liked, success: true });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}