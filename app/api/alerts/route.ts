import { NextResponse, NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-mobile';
import { query } from '../../../lib/db';

// POST - Create an alert
export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const user = auth.user;

  try {
    const { targetId, targetType, reason } = await request.json();

    if (!targetId || !targetType || !reason) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (targetType !== 'question' && targetType !== 'comment') {
      return NextResponse.json({ error: 'Type de cible invalide' }, { status: 400 });
    }

    // Check if user already alerted this target
    const existing = await query(
      'SELECT id FROM alerts WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [user.id, targetType, targetId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Vous avez déjà signalé ce contenu' }, { status: 400 });
    }

    // Check if target exists and is not already blocked
    if (targetType === 'question') {
      const question = await query(
        'SELECT id, is_blocked FROM questions WHERE id = $1',
        [targetId]
      );
      
      if (question.rows.length === 0) {
        return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 });
      }
      
      if (question.rows[0].is_blocked) {
        return NextResponse.json({ error: 'Cette question est déjà bloquée' }, { status: 400 });
      }
    }

    if (targetType === 'comment') {
      const comment = await query(
        'SELECT id, is_blocked FROM comments WHERE id = $1',
        [targetId]
      );
      
      if (comment.rows.length === 0) {
        return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 });
      }
      
      if (comment.rows[0].is_blocked) {
        return NextResponse.json({ error: 'Ce commentaire est déjà bloqué' }, { status: 400 });
      }
    }

    // Create alert - the trigger will handle blocking
    await query(
      `INSERT INTO alerts (user_id, target_type, target_id, reason)
       VALUES ($1, $2, $3, $4)`,
      [user.id, targetType, targetId, reason]
    );

    return NextResponse.json({ success: true, message: 'Signalement envoyé' });

  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du signalement' },
      { status: 500 }
    );
  }
}