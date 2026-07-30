import { NextResponse, NextRequest } from 'next/server';
import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        // Increment view count
        await query(
            'UPDATE questions SET view_count = view_count + 1 WHERE id = $1',
            [id]
        );

        // Get question with author, subject, and images + userLiked
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
                (SELECT COUNT(*) FROM likes WHERE question_id = q.id) as like_count,
                CASE 
                    WHEN EXISTS(SELECT 1 FROM likes WHERE question_id = q.id AND user_id = $2)
                    THEN true 
                    ELSE false 
                END as userLiked
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.id
            LEFT JOIN subjects s ON q.subject_id = s.id
            WHERE q.id = $1
        `, [id, session?.user?.id || null]);

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

        // Get comments with images - OPTIMIZED: Use JSON aggregation to avoid N+1
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
                CASE 
                    WHEN EXISTS(SELECT 1 FROM likes WHERE comment_id = c.id AND user_id = $2)
                    THEN true 
                    ELSE false 
                END as user_liked,
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
        `, [id, session?.user?.id || null]);

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
