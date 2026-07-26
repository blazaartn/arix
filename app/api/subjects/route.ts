import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
    try {
        const result = await query(`
            SELECT id, name, code, description 
            FROM subjects 
            ORDER BY name ASC
        `);

        return NextResponse.json({ 
            success: true, 
            subjects: result.rows || []
        });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ 
            success: true, 
            subjects: []
        });
    }
}