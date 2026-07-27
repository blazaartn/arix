import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const cacheKey = getCacheKey('likes', { questionId });
    
    const result = await getCached(
      cacheKey,
      async () => {
        const countResult = await query(
          'SELECT COUNT(*) as count FROM likes WHERE question_id = $1',
          [questionId]
        );

        let userLiked = false;
        const session = await getServerSession(authOptions);
        if (session && session.user && session.user.id) {
          const userResult = await query(
            'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
            [session.user.id, questionId]
          );
          userLiked = userResult.rows.length > 0;
        }

        return {
          count: parseInt(countResult.rows[0].count),
          liked: userLiked
        };
      },
      CACHE_TTL.LIKES
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ count: 0, liked: false });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('🔍 POST /api/likes - Starting...');
  
  // ✅ Try to get session with more debug info
  const session = await getServerSession(authOptions);
  
  console.log('🔍 Session object:', {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    email: session?.user?.email,
    fullUser: session?.user
  });
  
  // ✅ Better session validation with detailed errors
  if (!session) {
    console.log('❌ No session found');
    return NextResponse.json(
      { error: 'Non autorisé - Veuillez vous connecter' },
      { status: 401 }
    );
  }
  
  if (!session.user) {
    console.log('❌ Session has no user object');
    return NextResponse.json(
      { error: 'Session invalide - Aucun utilisateur' },
      { status: 401 }
    );
  }
  
  if (!session.user.id) {
    console.log('❌ Session user has no id:', session.user);
    return NextResponse.json(
      { error: 'ID utilisateur manquant - Veuillez vous reconnecter' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { questionId } = body;
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const userId = session.user.id;
    console.log('✅ User ID from session:', userId);

    // Check if like exists
    const existing = await query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
      [userId, questionId]
    );

    let liked = false;

    if (existing.rows.length > 0) {
      // Unlike
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND question_id = $2',
        [userId, questionId]
      );
      liked = false;
      console.log('✅ Unlike successful');
    } else {
      // Like
      await query(
        'INSERT INTO likes (user_id, question_id) VALUES ($1, $2)',
        [userId, questionId]
      );
      liked = true;
      console.log('✅ Like successful');

      // Give XP to question owner
      const questionOwner = await query(
        'SELECT user_id, title FROM questions WHERE id = $1',
        [questionId]
      );

      if (questionOwner.rows.length > 0 && questionOwner.rows[0].user_id !== userId) {
        await addXP(
          questionOwner.rows[0].user_id, 
          XP_RULES.LIKE_RECEIVED, 
          'like_received', 
          questionId
        );

        await createNotification({
          userId: questionOwner.rows[0].user_id,
          actorId: userId,
          type: 'like',
          content: `a aimé votre question "${questionOwner.rows[0].title}"`,
          questionId: questionId,
          link: `/questions/${questionId}`
        });
      }
    }

    const countResult = await query(
      'SELECT COUNT(*) as count FROM likes WHERE question_id = $1',
      [questionId]
    );

    invalidateCache(`likes:{"questionId":"${questionId}"}`);
    invalidateCache(`question:{"id":"${questionId}"}`);
    invalidateCache('questions:*');

    return NextResponse.json({ 
      liked, 
      count: parseInt(countResult.rows[0].count)
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