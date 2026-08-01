import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../../lib/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    // ✅ Remove like_count from the query
    const result = await query(
      `SELECT 
        q.id, 
        q.title, 
        q.content, 
        q.subject_name, 
        q.created_at,
        q.view_count,
        (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE question_id = q.id) as comments_count,
        (SELECT COUNT(*) FROM images WHERE question_id = q.id) as images_count
       FROM questions q
       WHERE q.user_id = $1
       ORDER BY q.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      questions: result.rows || []
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des posts' },
      { status: 500 }
    );
  }
}