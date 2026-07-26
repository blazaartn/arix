import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';

// GET - Get like count and user like status (optimized with indexes)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // ✅ Single query with both count and user status (if logged in)
    const session = await getServerSession(authOptions);
    
    let count = 0;
    let userLiked = false;

    // Get count (indexed query - should be fast after adding index)
    const countResult = await query(
      'SELECT COUNT(*) as count FROM likes WHERE question_id = $1',
      [questionId]
    );
    count = parseInt(countResult.rows[0].count);

    // Get user status if logged in
    if (session) {
      const userResult = await query(
        'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
        [session.user.id, questionId]
      );
      userLiked = userResult.rows.length > 0;
    }

    return NextResponse.json({ 
      count, 
      liked: userLiked 
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    // Return safe fallback
    return NextResponse.json({ count: 0, liked: false });
  }
}

// POST - Toggle like (rest remains the same)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const existing = await query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
      [session.user.id, questionId]
    );

    let liked = false;

    if (existing.rows.length > 0) {
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND question_id = $2',
        [session.user.id, questionId]
      );
      liked = false;
    } else {
      await query(
        'INSERT INTO likes (user_id, question_id) VALUES ($1, $2)',
        [session.user.id, questionId]
      );
      liked = true;

      const questionOwner = await query(
        'SELECT user_id, title FROM questions WHERE id = $1',
        [questionId]
      );

      if (questionOwner.rows.length > 0 && questionOwner.rows[0].user_id !== session.user.id) {
        await addXP(
          questionOwner.rows[0].user_id, 
          XP_RULES.LIKE_RECEIVED, 
          'like_received', 
          questionId
        );

        await createNotification({
          userId: questionOwner.rows[0].user_id,
          actorId: session.user.id,
          type: 'like',
          content: `a aimé votre question "${questionOwner.rows[0].title}"`,
          questionId: questionId,
          link: `/questions/${questionId}`
        });
      }
    }

    return NextResponse.json({ liked });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'action' }, { status: 500 });
  }
}