import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const questionIdsParam = searchParams.get('questionIds');
    
    const auth = await getAuthenticatedUser(request);
    
    // ✅ Handle multiple question IDs (batch request)
    if (questionIdsParam) {
      const questionIds = questionIdsParam.split(',');
      
      if (questionIds.length === 0) {
        return NextResponse.json({ results: [] });
      }

      // ✅ Single query for ALL questions
      const result = await query(
        `SELECT question_id, COUNT(*) as count FROM likes 
         WHERE question_id = ANY($1) 
         GROUP BY question_id`,
        [questionIds]
      );

      const countMap: Record<string, number> = {};
      result.rows.forEach(row => {
        countMap[row.question_id] = parseInt(row.count);
      });

      // ✅ Check user likes for all questions
      let userLikeMap: Record<string, boolean> = {};
      
      if (auth?.user?.id) {
        const userLikesResult = await query(
          `SELECT question_id FROM likes 
           WHERE user_id = $1 AND question_id = ANY($2)`,
          [auth.user.id, questionIds]
        );
        userLikesResult.rows.forEach(row => {
          userLikeMap[row.question_id] = true;
        });
      }

      const results = questionIds.map(id => ({
        questionId: id,
        count: countMap[id] || 0,
        liked: userLikeMap[id] || false
      }));

      return NextResponse.json({ results });
    }

    // ✅ Single question
    if (questionId) {
      const countResult = await query(
        'SELECT COUNT(*) as count FROM likes WHERE question_id = $1',
        [questionId]
      );

      let userLiked = false;
      if (auth?.user?.id) {
        const userResult = await query(
          'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
          [auth.user.id, questionId]
        );
        userLiked = userResult.rows.length > 0;
      }

      return NextResponse.json({ 
        count: parseInt(countResult.rows[0].count) || 0,
        liked: userLiked 
      });
    }

    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ count: 0, liked: false });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const userId = user.id;

    const existing = await query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
      [userId, questionId]
    );

    let liked = false;

    if (existing.rows.length > 0) {
      await query('DELETE FROM likes WHERE user_id = $1 AND question_id = $2', [userId, questionId]);
      liked = false;
    } else {
      await query('INSERT INTO likes (user_id, question_id) VALUES ($1, $2)', [userId, questionId]);
      liked = true;

      const questionOwner = await query(
        'SELECT user_id, title FROM questions WHERE id = $1',
        [questionId]
      );

      if (questionOwner.rows.length > 0 && questionOwner.rows[0].user_id !== userId) {
        addXP(questionOwner.rows[0].user_id, XP_RULES.LIKE_RECEIVED, 'like_received', questionId).catch(() => {});
        createNotification({
          userId: questionOwner.rows[0].user_id,
          actorId: userId,
          type: 'like',
          content: `a aimé votre question "${questionOwner.rows[0].title}"`,
          questionId: questionId,
          link: `/questions/${questionId}`
        }).catch(() => {});
      }
    }

    const countResult = await query(
      'SELECT COUNT(*) as count FROM likes WHERE question_id = $1',
      [questionId]
    );

    return NextResponse.json({ 
      liked, 
      count: parseInt(countResult.rows[0].count) || 0
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'action',
      liked: false,
      count: 0
    }, { status: 500 });
  }
}