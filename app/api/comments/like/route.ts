import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { commentId } = await request.json();
        if (!commentId) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Check if comment exists
        const comment = await query(
            'SELECT id FROM comments WHERE id = $1',
            [commentId]
        );
        if (comment.rows.length === 0) {
            return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 });
        }

        // Check if already liked
        const existing = await query(
            'SELECT * FROM likes WHERE user_id = $1 AND comment_id = $2',
            [session.user.id, commentId]
        );

        if (existing.rows.length > 0) {
            // Unlike
            await query(
                'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
                [session.user.id, commentId]
            );
            return NextResponse.json({ liked: false, success: true });
        } else {
            // Like
            await query(
                'INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)',
                [session.user.id, commentId]
            );
            return NextResponse.json({ liked: true, success: true });
        }
    } catch (error) {
        console.error('Error toggling comment like:', error);
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}