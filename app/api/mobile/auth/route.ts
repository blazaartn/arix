import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, email, name, image, testEmail } = body;

    // ============================================
    // 🧪 TEST MODE - Skip Google Verification
    // ============================================
    if (process.env.NODE_ENV === 'development' && testEmail) {
      const userResult = await query('SELECT * FROM users WHERE email = $1', [testEmail]);
      
      if (userResult.rows.length > 0) {
        const u = userResult.rows[0];
        const token = jwt.sign(
          { userId: u.id, email: u.email },
          JWT_SECRET!,
          { expiresIn: '30d' }
        );
        
        return NextResponse.json({
          token,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            avatar_url: u.avatar_url,
            xp_points: u.xp_points || 0,
            level: u.level || 1,
            role: u.role || 'student'
          }
        });
      }
      
      return NextResponse.json(
        { error: 'User not found with this email' },
        { status: 404 }
      );
    }

    // ============================================
    // 🔐 PRODUCTION - Verify Google ID Token
    // ============================================
    if (!idToken) {
      return NextResponse.json(
        { error: 'Google ID token is required' },
        { status: 400 }
      );
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 401 }
      );
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const verifiedEmail = payload.email;
    const verifiedName = payload.name || verifiedEmail?.split('@')[0] || 'User';
    const verifiedPicture = payload.picture || null;

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      );
    }

    // ============================================
    // 👤 Find or Create User
    // ============================================
    let userResult = await query('SELECT * FROM users WHERE email = $1', [verifiedEmail]);
    let user;

    if (userResult.rows.length === 0) {
      const newUser = await query(
        `INSERT INTO users (email, name, avatar_url, role, xp_points, level)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, name, avatar_url, role, xp_points, level`,
        [verifiedEmail, verifiedName, verifiedPicture, 'student', 0, 1]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      // Update name/avatar if changed
      if (user.name !== verifiedName || user.avatar_url !== verifiedPicture) {
        await query(
          `UPDATE users SET name = $1, avatar_url = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [verifiedName, verifiedPicture, user.id]
        );
        user.name = verifiedName;
        user.avatar_url = verifiedPicture;
      }
    }

    // ============================================
    // 🎫 Generate JWT
    // ============================================
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        xp_points: user.xp_points || 0,
        level: user.level || 1,
        role: user.role || 'student'
      }
    });

  } catch (error) {
    console.error('❌ Mobile auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}