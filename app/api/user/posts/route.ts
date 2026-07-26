import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const result = await query(
            `SELECT 
                id, 
                title, 
                content, 
                subject_name, 
                created_at,
                view_count,
                like_count,
                comments_count,
                images_count
             FROM questions
             WHERE user_id = $1 AND is_deleted = false
             ORDER BY created_at DESC`,
            [session.user.id]
        );

        return NextResponse.json({
            success: true,
            questions: result.rows
        });

    } catch (error) {
        console.error('Error fetching user posts:', error);
        return NextResponse.json(
            { error: 'Erreur lors du chargement des posts' },
            { status: 500 }
        );
    }
}