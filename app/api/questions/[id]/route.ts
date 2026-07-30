import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // ✅ Increment view count
    try {
      await query(
        'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
        [id]
      );
    } catch (viewError) {
      console.warn('⚠️ View count update failed, continuing');
    }

    // ✅ Get question with author and all counts
    const questionResult = await query(`
      SELECT 
        q.id,
        q.title,
        q.content,
        q.user_id,
        q.subject_name,
        q.code_content,
        q.code_language,
        q.view_count,
        q.created_at,
        q.updated_at,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        (SELECT COUNT(*) FROM comments WHERE question_id = q.id) as comments_count,
        (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id]);

    if (questionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    // ✅ Get question images
    const imagesResult = await query(
      'SELECT id, image_url, caption, is_primary FROM images WHERE question_id = $1 ORDER BY upload_order ASC',
      [id]
    );

    // ✅ Get comments with images and like counts
    const commentsResult = await query(`
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
      ORDER BY c.created_at ASC
    `, [id]);

    // ✅ Get user like status
    const session = await getServerSession(authOptions);
    let userLiked = false;
    if (session?.user?.id) {
      try {
        const likeResult = await query(
          'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
          [session.user.id, id]
        );
        userLiked = likeResult.rows.length > 0;
      } catch {
        userLiked = false;
      }
    }

    const question = {
      ...questionResult.rows[0],
      images: imagesResult.rows || [],
      comments: commentsResult.rows || [],
      userLiked,
      // ✅ Ensure these are numbers
      like_count: parseInt(questionResult.rows[0].like_count) || 0,
      comments_count: parseInt(questionResult.rows[0].comments_count) || 0,
      view_count: parseInt(questionResult.rows[0].view_count) || 0,
    };

    return NextResponse.json({ 
      success: true, 
      question 
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la question' },
      { status: 500 }
    );
  }
}