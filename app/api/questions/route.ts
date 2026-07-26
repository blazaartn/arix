import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { addXP, XP_RULES } from '../../../lib/xp';

// ============================================
// GET - Fetch all questions OR single question with images
// ============================================
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || 'recent';
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        // ✅ If ID is provided, fetch single question with details
        if (id) {
            // Increment view count
            await query(
                'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
                [id]
            );

            // Get question with author, code, and images
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

            // Get question images
            const imagesResult = await query(
                'SELECT id, image_url, caption, is_primary FROM images WHERE question_id = $1 ORDER BY upload_order ASC',
                [id]
            );

            // ✅ Get comments with their images
            let commentsResult: any[] = [];
            try {
                const result = await query(`
                    SELECT 
                        c.id,
                        c.content,
                        c.user_id,
                        c.created_at,
                        u.name as author_name,
                        u.avatar_url as author_avatar,
                        u.role as author_role,
                        (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count
                    FROM comments c
                    LEFT JOIN users u ON c.user_id = u.id
                    WHERE c.question_id = $1
                    ORDER BY c.created_at ASC
                `, [id]);

                commentsResult = result.rows || [];

                // Get images for each comment
                for (let i = 0; i < commentsResult.length; i++) {
                    const comment = commentsResult[i];
                    try {
                        const commentImages = await query(
                            'SELECT id, image_url FROM images WHERE comment_id = $1 ORDER BY upload_order ASC',
                            [comment.id]
                        );
                        comment.images = commentImages.rows || [];
                    } catch {
                        comment.images = [];
                    }
                }
            } catch {
                commentsResult = [];
            }

            // Check if user liked
            let userLiked = false;
            const session = await getServerSession(authOptions);
            if (session) {
                try {
                    const likeResult = await query(
                        'SELECT * FROM likes WHERE user_id = $1 AND question_id = $2',
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
                comments: commentsResult || [],
                userLiked
            };

            return NextResponse.json({ 
                success: true, 
                question 
            });
        }

        // ✅ Otherwise, fetch all questions with filters and search
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
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.role as author_role,
                (SELECT COUNT(*) FROM comments WHERE question_id = q.id) as comments_count,
                (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count,
                (SELECT COUNT(*) FROM images WHERE question_id = q.id) as images_count
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.id
        `;

        const params: any[] = [];
        const conditions: string[] = [];

        // ✅ Add search condition
        if (search) {
            conditions.push(`(q.title ILIKE $${params.length + 1} OR q.content ILIKE $${params.length + 1} OR q.subject_name ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            queryText += ` WHERE ${conditions.join(' AND ')}`;
        }

        queryText += ` GROUP BY q.id, u.id`;

        // Sorting
        if (sort === 'popular') {
            queryText += ` ORDER BY like_count DESC, q.created_at DESC`;
        } else if (sort === 'unanswered') {
            queryText += ` HAVING (SELECT COUNT(*) FROM comments WHERE question_id = q.id) = 0 ORDER BY q.created_at DESC`;
        } else {
            queryText += ` ORDER BY q.created_at DESC`;
        }

        queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const questions = await query(queryText, params);

        // Get images for each question
        for (let i = 0; i < questions.rows.length; i++) {
            const q = questions.rows[i];
            try {
                const images = await query(
                    'SELECT id, image_url, is_primary FROM images WHERE question_id = $1 ORDER BY upload_order ASC LIMIT 1',
                    [q.id]
                );
                q.image = images.rows[0] || null;
            } catch {
                q.image = null;
            }
        }

        return NextResponse.json({ 
            success: true, 
            questions: questions.rows || [],
            hasMore: questions.rows.length === limit
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
// POST - Create a new question with images and code
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

        if (!title || !title.trim()) {
            return NextResponse.json(
                { error: 'Le titre est requis' },
                { status: 400 }
            );
        }

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Le contenu est requis' },
                { status: 400 }
            );
        }

        if (!subjectName || !subjectName.trim()) {
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
                u.role as author_role
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

        if (!title || !title.trim()) {
            return NextResponse.json(
                { error: 'Le titre est requis' },
                { status: 400 }
            );
        }

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Le contenu est requis' },
                { status: 400 }
            );
        }

        const question = await query(
            'SELECT * FROM questions WHERE id = $1',
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

        if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
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
// DELETE - Delete a question with cascade
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

        // ✅ Check if question exists
        const question = await query(
            'SELECT * FROM questions WHERE id = $1',
            [id]
        );

        if (question.rows.length === 0) {
            return NextResponse.json(
                { error: 'Question non trouvée' },
                { status: 404 }
            );
        }

        // ✅ Check ownership (author or admin)
        if (question.rows[0].user_id !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        // ✅ Get images to delete from blob storage
        const images = await query(
            'SELECT image_url, imagebb_id FROM images WHERE question_id = $1',
            [id]
        );

        // ✅ Delete from blob storage
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

        // ✅ Delete the question (cascade will handle likes, comments, images)
        // Foreign keys with ON DELETE CASCADE will automatically delete:
        // - comments (and their likes & images)
        // - likes on the question
        // - images linked to the question
        await query(
            'DELETE FROM questions WHERE id = $1',
            [id]
        );

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