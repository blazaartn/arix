import { NextResponse, NextRequest } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;

        // Increment view count
        await query(
            'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
            [id]
        );

        // Get question with author, subject, and images
        const questionResult = await query(`
            SELECT 
                q.id,
                q.title,
                q.content,
                q.user_id,
                q.subject_id,
                q.view_count,
                q.created_at,
                q.updated_at,
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.role as author_role,
                s.name as subject_name,
                (SELECT COUNT(*) FROM comments WHERE question_id = q.id) as comments_count,
                (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.id
            LEFT JOIN subjects s ON q.subject_id = s.id
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

        // Get comments with images
        const commentsResult = await query(`
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

        // Get images for each comment
        for (const comment of commentsResult.rows) {
            const commentImages = await query(
                'SELECT id, image_url FROM images WHERE comment_id = $1 ORDER BY upload_order ASC',
                [comment.id]
            );
            comment.images = commentImages.rows || [];
        }

        const question = {
            ...questionResult.rows[0],
            images: imagesResult.rows || [],
            comments: commentsResult.rows || []
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