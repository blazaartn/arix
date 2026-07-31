import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';
import { createNotification } from '../../../lib/notifications';
import { getCached, CACHE_TTL, invalidateCache, getCacheKey } from '../../../lib/cache';

// ============================================
// GET - Fetch questions (list or single)
// ============================================
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'recent';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    const session = await getServerSession(authOptions);

    // ==========================================
    // SINGLE QUESTION
    // ==========================================
    if (id) {
      // Check if question exists and get status
      const checkResult = await query(`
        SELECT 
          q.id,
          q.is_blocked,
          q.alert_count,
          q.user_id
        FROM questions q
        WHERE q.id = $1
      `, [id]);

      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Question non trouvée' },
          { status: 404 }
        );
      }

      const questionData = checkResult.rows[0];

      if (questionData.is_blocked) {
        return NextResponse.json(
          { error: 'Cette question a été bloquée' },
          { status: 403 }
        );
      }

      if (session?.user?.id) {
        const reported = await query(
          'SELECT id FROM alerts WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
          [session.user.id, 'question', id]
        );
        if (reported.rows.length > 0) {
          return NextResponse.json(
            { error: 'Vous avez signalé cette question' },
            { status: 403 }
          );
        }
      }

      // Increment view count
      await query(
        'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
        [id]
      );

      // ✅ DYNAMIC RANK: Count users with more XP than the author
      const result = await query(`
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
          q.is_blocked,
          q.alert_count,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.role as author_role,
          (
            SELECT COUNT(*) + 1 
            FROM users u2 
            WHERE u2.xp_points > u.xp_points 
              AND u2.is_active = true
          ) as user_rank,
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', i.id,
                'image_url', i.image_url,
                'caption', i.caption,
                'is_primary', i.is_primary
              ) ORDER BY i.upload_order ASC
            ) FROM images i WHERE i.question_id = q.id),
            '[]'::json
          ) as images,
          (SELECT COUNT(*) FROM comments WHERE question_id = q.id AND is_blocked = false) as comments_count,
          (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.id = $1
        GROUP BY q.id, u.id, u.xp_points
      `, [id]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Question non trouvée' },
          { status: 404 }
        );
      }

      // Get comments (only non-blocked)
      const commentsResult = await query(`
        SELECT 
          c.id,
          c.content,
          c.user_id,
          c.created_at,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.role as author_role,
          (
            SELECT COUNT(*) + 1 
            FROM users u2 
            WHERE u2.xp_points > u.xp_points 
              AND u2.is_active = true
          ) as user_rank,
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
        WHERE c.question_id = $1 AND c.is_blocked = false
        ORDER BY c.created_at ASC
      `, [id]);

      // Check if user liked
      let userLiked = false;
      if (session && session.user?.id) {
        const likeResult = await query(
          'SELECT 1 FROM likes WHERE user_id = $1 AND question_id = $2 LIMIT 1',
          [session.user.id, id]
        );
        userLiked = likeResult.rows.length > 0;
      }

      const question = {
        ...result.rows[0],
        comments: commentsResult.rows || [],
        userLiked,
        like_count: parseInt(result.rows[0].like_count) || 0,
        comments_count: parseInt(result.rows[0].comments_count) || 0,
        view_count: parseInt(result.rows[0].view_count) || 0,
        alert_count: parseInt(result.rows[0].alert_count) || 0,
        user_rank: parseInt(result.rows[0].user_rank) || 0,
      };

      return NextResponse.json({ 
        success: true, 
        question 
      });
    }

    // ==========================================
    // LIST QUESTIONS (only non-blocked)
    // ==========================================
    const cacheKey = getCacheKey('questions', { search, sort, limit, offset });
    
    const data = await getCached(
      cacheKey,
      async () => {
        let queryText = `
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
            q.is_blocked,
            u.name as author_name,
            u.avatar_url as author_avatar,
            u.role as author_role,
            (
              SELECT COUNT(*) + 1 
              FROM users u2 
              WHERE u2.xp_points > u.xp_points 
                AND u2.is_active = true
            ) as user_rank,
            (SELECT COUNT(*) FROM comments WHERE question_id = q.id AND is_blocked = false) as comments_count,
            (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count,
            (SELECT COUNT(*) FROM images WHERE question_id = q.id) as images_count,
            (
              SELECT json_build_object(
                'id', i.id,
                'image_url', i.image_url,
                'is_primary', i.is_primary
              )
              FROM images i 
              WHERE i.question_id = q.id 
              ORDER BY i.upload_order ASC 
              LIMIT 1
            ) as image
          FROM questions q
          LEFT JOIN users u ON q.user_id = u.id
          WHERE q.is_blocked = false
        `;

        const params: any[] = [];
        const conditions: string[] = [];

        // Exclude questions the current user has reported
        if (session?.user?.id) {
          const reportedResult = await query(
            `SELECT target_id FROM alerts 
             WHERE user_id = $1 AND target_type = 'question'`,
            [session.user.id]
          );
          
          const reportedIds = reportedResult.rows.map((row: any) => row.target_id);
          
          if (reportedIds.length > 0) {
            const placeholders = reportedIds.map((_, i) => `$${params.length + 1 + i}`).join(',');
            conditions.push(`q.id NOT IN (${placeholders})`);
            params.push(...reportedIds);
          }
        }

        if (search) {
          conditions.push(`(
            q.title ILIKE $${params.length + 1} OR 
            q.content ILIKE $${params.length + 1} OR 
            q.subject_name ILIKE $${params.length + 1}
          )`);
          params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
          queryText += ` AND ${conditions.join(' AND ')}`;
        }

        queryText += ` GROUP BY q.id, u.id, u.xp_points`;

        if (sort === 'popular') {
          queryText += ` ORDER BY like_count DESC, q.created_at DESC`;
        } else if (sort === 'unanswered') {
          queryText += ` HAVING (SELECT COUNT(*) FROM comments WHERE question_id = q.id AND is_blocked = false) = 0 ORDER BY q.created_at DESC`;
        } else {
          queryText += ` ORDER BY q.created_at DESC`;
        }

        queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        return {
          questions: result.rows || [],
        };
      },
      CACHE_TTL.QUESTIONS_LIST
    );

    // Get user likes for all questions
    const questionIds = data.questions.map((q: any) => q.id);
    let userLikeMap: Record<string, boolean> = {};

    if (questionIds.length > 0 && session?.user?.id) {
      const userLikesResult = await query(
        `SELECT question_id FROM likes WHERE user_id = $1 AND question_id = ANY($2)`,
        [session.user.id, questionIds]
      );
      userLikesResult.rows.forEach((row: any) => {
        userLikeMap[row.question_id] = true;
      });
    }

    const questions = data.questions.map((q: any) => ({
      ...q,
      userLiked: userLikeMap[q.id] || false,
      user_rank: parseInt(q.user_rank) || 0,
    }));

    return NextResponse.json({ 
      success: true, 
      questions: questions || [],
      hasMore: questions.length === limit
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ 
      success: true, 
      questions: [],
      hasMore: false
    });
  }
}

// ============================================
// POST - Create a new question
// ============================================
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, subjectName, imageIds, codeContent, codeLanguage } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Le contenu est requis' },
        { status: 400 }
      );
    }

    if (!subjectName?.trim()) {
      return NextResponse.json(
        { error: 'La matière est requise' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO questions (user_id, title, content, subject_name, code_content, code_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, content, user_id, subject_name, code_content, code_language, created_at`,
      [session.user.id, title.trim(), content.trim(), subjectName.trim(), codeContent?.trim() || null, codeLanguage || 'javascript']
    );

    const question = result.rows[0];

    if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
      for (const imageId of imageIds) {
        await query(
          'UPDATE images SET question_id = $1 WHERE id = $2 AND user_id = $3',
          [question.id, imageId, session.user.id]
        );
      }
    }

    await addXP(session.user.id, XP_RULES.ASK_QUESTION, 'ask_question', question.id);

    const questionWithAuthor = await query(
      `SELECT 
        q.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        (
          SELECT COUNT(*) + 1 
          FROM users u2 
          WHERE u2.xp_points > u.xp_points 
            AND u2.is_active = true
        ) as user_rank
       FROM questions q
       LEFT JOIN users u ON q.user_id = u.id
       WHERE q.id = $1`,
      [question.id]
    );

    const images = await query(
      'SELECT id, image_url, caption, is_primary FROM images WHERE question_id = $1 ORDER BY upload_order ASC',
      [question.id]
    );

    const fullQuestion = {
      ...questionWithAuthor.rows[0],
      images: images.rows || []
    };

    await invalidateCache('questions:*');

    return NextResponse.json({ 
      success: true, 
      question: fullQuestion,
      message: 'Question publiée avec succès ! +50 XP'
    });

  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update a question
// ============================================
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, title, content, subjectName, codeContent, codeLanguage, imageIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Le contenu est requis' },
        { status: 400 }
      );
    }

    const question = await query(
      'SELECT user_id FROM questions WHERE id = $1',
      [id]
    );

    if (question.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    if (question.rows[0].user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const result = await query(
      `UPDATE questions 
       SET title = $1, content = $2, subject_name = $3, code_content = $4, code_language = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title.trim(), content.trim(), subjectName?.trim() || null, codeContent?.trim() || null, codeLanguage || 'javascript', id]
    );

    if (imageIds && Array.isArray(imageIds)) {
      await query(
        'DELETE FROM images WHERE question_id = $1 AND user_id = $2',
        [id, session.user.id]
      );
      for (const imageId of imageIds) {
        await query(
          'UPDATE images SET question_id = $1 WHERE id = $2 AND user_id = $3',
          [id, imageId, session.user.id]
        );
      }
    }

    await invalidateCache(getCacheKey('question', { id }));
    await invalidateCache('questions:*');

    return NextResponse.json({ 
      success: true, 
      question: result.rows[0],
      message: 'Question mise à jour'
    });

  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete a question
// ============================================
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    const question = await query(
      'SELECT user_id, is_blocked FROM questions WHERE id = $1',
      [id]
    );

    if (question.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    if (question.rows[0].user_id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Delete images from blob storage
    const images = await query(
      'SELECT image_url FROM images WHERE question_id = $1',
      [id]
    );

    if (images.rows.length > 0) {
      try {
        const { del } = await import('@vercel/blob');
        for (const img of images.rows) {
          try {
            const url = new URL(img.image_url);
            const pathname = url.pathname;
            if (pathname) {
              await del(pathname);
            }
          } catch (blobError) {
            console.error('Error deleting blob:', blobError);
          }
        }
      } catch (blobError) {
        console.error('Blob deletion error:', blobError);
      }
    }

    await query(
      'DELETE FROM questions WHERE id = $1',
      [id]
    );

    await invalidateCache(getCacheKey('question', { id }));
    await invalidateCache('questions:*');

    return NextResponse.json({ 
      success: true, 
      message: 'Question supprimée avec succès'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}