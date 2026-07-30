import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';

// ============================================
// PUT - Update username
// ============================================
export async function PUT(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { name } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Le nom est requis' },
                { status: 400 }
            );
        }

        if (name.trim().length < 2) {
            return NextResponse.json(
                { error: 'Le nom doit contenir au moins 2 caractères' },
                { status: 400 }
            );
        }

        // ✅ Update user name
        await query(
            'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [name.trim(), session.user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Nom mis à jour avec succès',
            name: name.trim()
        });

    } catch (error) {
        console.error('Error updating username:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE - Delete account (CASCADE)
// ============================================
export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const userId = session.user.id;

        // ✅ Soft delete - mark as inactive instead of hard delete
        // This preserves data integrity while removing user access
        await query(
            'UPDATE users SET is_active = false, deleted_at = CURRENT_TIMESTAMP, email = CONCAT(email, \'_deleted_\', NOW()) WHERE id = $1',
            [userId]
        );

        // If you want HARD DELETE (remove all data) instead:
        // All ON DELETE CASCADE will handle this automatically
        // await query('DELETE FROM users WHERE id = $1', [userId]);

        return NextResponse.json({
            success: true,
            message: 'Compte supprimé avec succès'
        });

    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du compte' },
            { status: 500 }
        );
    }
}

// ============================================
// POST - Send message to superadmin
// ============================================
export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { subject, content } = await request.json();

        if (!subject || !subject.trim()) {
            return NextResponse.json(
                { error: 'Le sujet est requis' },
                { status: 400 }
            );
        }

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Le message est requis' },
                { status: 400 }
            );
        }

        // ✅ Save message
        const result = await query(
            `INSERT INTO messages (user_id, subject, content, status)
             VALUES ($1, $2, $3, 'unread')
             RETURNING id, subject, content, status, created_at`,
            [session.user.id, subject.trim(), content.trim()]
        );

        return NextResponse.json({
            success: true,
            message: 'Message envoyé avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        );
    }
}