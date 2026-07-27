import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    // ✅ Single question
    if (id) {
      const result = await query(`
        SELECT 
          q.id, q.title, q.content, q.user_id, q.subject_name,
          q.code_content, q.code_language, q.view_count, q.created_at,
          u.name as author_name, u.avatar_url as author_avatar, u.role as author_role
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 });
      }

      return NextResponse.json({ success: true, question: result.rows[0] });
    }

    // ✅ List questions
    let queryText = `
      SELECT 
        q.id, q.title, q.content, q.user_id, q.subject_name,
        q.code_content, q.code_language, q.view_count, q.created_at,
        u.name as author_name, u.avatar_url as author_avatar, u.role as author_role
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
    `;

    const params: any[] = [];
    if (search) {
      queryText += ` WHERE q.title ILIKE $1 OR q.content ILIKE $1`;
      params.push(`%${search}%`);
    }

    queryText += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // ✅ Get counts in batch
    const questionIds = result.rows.map(q => q.id);
    let likeCounts: Record<string, number> = {};
    let commentCounts: Record<string, number> = {};

    if (questionIds.length > 0) {
      const likesResult = await query(
        `SELECT question_id, COUNT(*) as count FROM likes 
         WHERE question_id = ANY($1) 
         GROUP BY question_id`,
        [questionIds]
      );
      likesResult.rows.forEach(row => {
        likeCounts[row.question_id] = parseInt(row.count);
      });

      const commentsResult = await query(
        `SELECT question_id, COUNT(*) as count FROM comments 
         WHERE question_id = ANY($1) 
         GROUP BY question_id`,
        [questionIds]
      );
      commentsResult.rows.forEach(row => {
        commentCounts[row.question_id] = parseInt(row.count);
      });
    }

    const questions = result.rows.map(q => ({
      ...q,
      like_count: likeCounts[q.id] || 0,
      comments_count: commentCounts[q.id] || 0,
    }));

    return NextResponse.json({ 
      success: true, 
      questions,
      hasMore: questions.length === limit
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: true, 
      questions: [],
      hasMore: false
    });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, subjectName, imageIds, codeContent, codeLanguage } = body;

    if (!title?.trim() || !content?.trim() || !subjectName?.trim()) {
      return NextResponse.json({ error: 'Champs requis' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO questions (user_id, title, content, subject_name, code_content, code_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [session.user.id, title.trim(), content.trim(), subjectName.trim(), codeContent?.trim() || null, codeLanguage || 'javascript']
    );

    const question = result.rows[0];

    if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
      for (const imageId of imageIds) {
        await query('UPDATE images SET question_id = $1 WHERE id = $2 AND user_id = $3', [question.id, imageId, session.user.id]);
      }
    }

    await addXP(session.user.id, XP_RULES.ASK_QUESTION, 'ask_question', question.id);

    return NextResponse.json({ 
      success: true, 
      question: { ...question, author_name: session.user.name, author_avatar: session.user.avatar_url },
      message: 'Question publiée !'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}