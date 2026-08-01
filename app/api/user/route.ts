import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../lib/db';
import { invalidateCache } from '../../../lib/cache';

// ============================================
// PUT - Update username
// ============================================
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

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

    await query(
      'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [name.trim(), user.id]
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
// DELETE - Hard delete account with CASCADE
// ============================================
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const userId = user.id;

    // ✅ Hard delete – ON DELETE CASCADE removes all related records
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // ✅ Invalidate cache
    await invalidateCache(`user:${userId}`);
    await invalidateCache(`user:posts:${userId}`);
    await invalidateCache(`questions:*`);
    await invalidateCache(`comments:*`);
    await invalidateCache(`ranking:*`);
    await invalidateCache(`notifications:*"userId":"${userId}"*`);

    return NextResponse.json({
      success: true,
      message: 'Compte et toutes les données associées supprimées avec succès'
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
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

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

    const result = await query(
      `INSERT INTO messages (user_id, subject, content, status)
       VALUES ($1, $2, $3, 'unread')
       RETURNING id, subject, content, status, created_at`,
      [user.id, subject.trim(), content.trim()]
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