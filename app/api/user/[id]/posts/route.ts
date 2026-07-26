import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await query(
      `SELECT 
        q.id, 
        q.title, 
        q.content, 
        q.subject_name, 
        q.created_at,
        q.view_count
       FROM questions q
       WHERE q.user_id = $1
       ORDER BY q.created_at DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      questions: result.rows || []
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des posts' },
      { status: 500 }
    );
  }
}