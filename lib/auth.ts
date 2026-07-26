import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { query } from './db';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            created_at: string;
            id: string;
            email: string;
            name: string;
            avatar_url: string;
            xp_points: number;
            level: number;
            role: string; // ✅ Added role
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
        email?: string;
        name?: string;
        picture?: string;
        role?: string; // ✅ Added role
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }): Promise<boolean> {
            if (account?.provider === 'google') {
                try {
                    if (!user.email) return false;
                    
                    const googleId = profile?.sub ?? undefined;
                    const avatarUrl = user.image ?? undefined;
                    const userName = user.name ?? 'User';
                    
                    const existingUser = await query(
                        'SELECT * FROM users WHERE email = $1',
                        [user.email]
                    );

                    if (existingUser.rows.length === 0) {
                        // ✅ New user - default role is 'student'
                        await query(
                            `INSERT INTO users (email, name, google_id, avatar_url, role)
                             VALUES ($1, $2, $3, $4, $5)`,
                            [user.email, userName, googleId, avatarUrl, 'student']
                        );
                    } else {
                        // ✅ Update existing user, but keep role if already set
                        await query(
                            `UPDATE users 
                             SET name = $1, google_id = $2, avatar_url = $3
                             WHERE email = $4`,
                            [userName, googleId, avatarUrl, user.email]
                        );
                    }
                    
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        
        async session({ session, token }): Promise<Session> {
            if (session.user && token.email) {
                try {
                    const user = await query(
                        'SELECT id, email, name, avatar_url, xp_points, level, role FROM users WHERE email = $1',
                        [token.email]
                    );
                    
                    if (user.rows.length > 0) {
                        const userData = user.rows[0];
                        session.user.id = userData.id;
                        session.user.xp_points = userData.xp_points || 0;
                        session.user.level = userData.level || 1;
                        session.user.avatar_url = userData.avatar_url;
                        session.user.email = userData.email;
                        session.user.name = userData.name;
                        session.user.role = userData.role || 'student'; // ✅ Added role
                    }
                } catch (error) {
                    // Silent fail
                }
            }
            return session;
        },
        
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                token.userId = user.id;
                token.email = user.email ?? undefined;
                token.name = user.name ?? undefined;
                token.picture = user.image ?? undefined;
                // ✅ We'll get role from database in session callback
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);