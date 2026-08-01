// app/api/mobile/auth/token/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, image } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get or create user from database
    let user = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      // Create new user
      const newUser = await query(
        `INSERT INTO users (email, name, avatar_url, role, xp_points, level)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, name, avatar_url, role, xp_points, level`,
        [email, name || email.split('@')[0], image || null, 'student', 0, 1]
      );
      user = newUser;
    }

    const userData = user.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
        xp_points: userData.xp_points || 0,
        level: userData.level || 1,
        role: userData.role || 'student',
      }
    });

  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}