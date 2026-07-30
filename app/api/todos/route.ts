import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { query } from '../../../lib/db';

// ✅ GET - Fetch user's todos
export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all';
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '50');

        let queryText = `
            SELECT id, user_id, text, completed, due_date, created_at, updated_at
            FROM todos
            WHERE user_id = $1
        `;
        const params: any[] = [session.user.id];
        let paramIndex = 2;

        if (filter === 'active') {
            queryText += ` AND completed = false`;
        } else if (filter === 'completed') {
            queryText += ` AND completed = true`;
        }

        if (search) {
            queryText += ` AND text ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        queryText += ` ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        const result = await query(queryText, params);

        return NextResponse.json({
            success: true,
            todos: result.rows
        });

    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json(
            { error: 'Erreur lors du chargement des todos' },
            { status: 500 }
        );
    }
}

// ✅ POST - Create a new todo
export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { text, dueDate } = body;

        if (!text || !text.trim()) {
            return NextResponse.json(
                { error: 'Le texte est requis' },
                { status: 400 }
            );
        }

        const result = await query(
            `INSERT INTO todos (user_id, text, due_date)
             VALUES ($1, $2, $3)
             RETURNING id, user_id, text, completed, due_date, created_at, updated_at`,
            [session.user.id, text.trim(), dueDate || null]
        );

        return NextResponse.json({
            success: true,
            todo: result.rows[0],
            message: 'Tâche ajoutée avec succès'
        });

    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

// ✅ PUT - Update a todo
export async function PUT(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, text, completed, dueDate } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            );
        }

        // Check ownership
        const check = await query(
            'SELECT user_id FROM todos WHERE id = $1',
            [id]
        );

        if (check.rows.length === 0) {
            return NextResponse.json(
                { error: 'Tâche non trouvée' },
                { status: 404 }
            );
        }

        if (check.rows[0].user_id !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const updates: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (text !== undefined) {
            updates.push(`text = $${paramIndex}`);
            params.push(text.trim());
            paramIndex++;
        }

        if (completed !== undefined) {
            updates.push(`completed = $${paramIndex}`);
            params.push(completed);
            paramIndex++;
        }

        if (dueDate !== undefined) {
            updates.push(`due_date = $${paramIndex}`);
            params.push(dueDate || null);
            paramIndex++;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'Aucune modification' },
                { status: 400 }
            );
        }

        params.push(id);

        const result = await query(
            `UPDATE todos SET ${updates.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING id, user_id, text, completed, due_date, created_at, updated_at`,
            params
        );

        return NextResponse.json({
            success: true,
            todo: result.rows[0],
            message: 'Tâche mise à jour'
        });

    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// ✅ DELETE - Delete a todo
export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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

        // Check ownership
        const check = await query(
            'SELECT user_id FROM todos WHERE id = $1',
            [id]
        );

        if (check.rows.length === 0) {
            return NextResponse.json(
                { error: 'Tâche non trouvée' },
                { status: 404 }
            );
        }

        if (check.rows[0].user_id !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        await query(
            'DELETE FROM todos WHERE id = $1',
            [id]
        );

        return NextResponse.json({
            success: true,
            message: 'Tâche supprimée'
        });

    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}