import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    let queryText = `
      SELECT 
        q.id, 
        q.title, 
        q.content, 
        q.subject_name, 
        q.created_at,
        q.view_count,
        q.is_blocked,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        u.user_rank,
        (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE question_id = q.id AND is_blocked = false) as comments_count,
        (SELECT COUNT(*) FROM images WHERE question_id = q.id) as images_count
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.user_id = $1
        AND q.is_blocked = false
    `;

    const params: any[] = [id];

    // ✅ Exclude questions the current user has reported (if logged in)
    if (session?.user?.id) {
      const reportedResult = await query(
        `SELECT target_id FROM alerts 
         WHERE user_id = $1 AND target_type = 'question'`,
        [session.user.id]
      );
      
      const reportedIds = reportedResult.rows.map((row: any) => row.target_id);
      
      if (reportedIds.length > 0) {
        const placeholders = reportedIds.map((_, i) => `$${params.length + 1 + i}`).join(',');
        queryText += ` AND q.id NOT IN (${placeholders})`;
        params.push(...reportedIds);
      }
    }

    queryText += ` ORDER BY q.created_at DESC`;

    const result = await query(queryText, params);

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