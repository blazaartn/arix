import { NextAuthOptions } from 'next-auth';
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
            role: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
        email?: string;
        name?: string;
        picture?: string;
        role?: string;
    }
}

// ✅ This is the ONLY export
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

                    const avatarUrl = user.image ?? undefined;
                    const userName = user.name ?? 'User';

                    console.log('🔐 SignIn attempt:', { email: user.email });

                    // Check if user exists by email
                    let existingUser = await query(
                        'SELECT * FROM users WHERE email = $1',
                        [user.email]
                    );

                    if (existingUser.rows.length > 0) {
                        await query(
                            `UPDATE users 
                             SET name = $1, avatar_url = $2, 
                                 is_active = true, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
                             WHERE email = $3`,
                            [userName, avatarUrl, user.email]
                        );
                        console.log('✅ User updated:', user.email);
                        return true;
                    }

                    // Create new user
                    const result = await query(
                        `INSERT INTO users (email, name, avatar_url, role)
                         VALUES ($1, $2, $3, $4)
                         RETURNING id`,
                        [user.email, userName, avatarUrl, 'student']
                    );

                    const userId = result.rows[0].id;
                    console.log('✅ New user created:', userId);

                    // Default todos
                    const defaultTodos = [
                        { text: '📚 Réviser le cours du jour', dueDate: null },
                        { text: '😴 Dormir au moins 7h', dueDate: null },
                        { text: '📝 Corriger mes fautes de langue', dueDate: null },
                        { text: '📖 Lire 15 minutes', dueDate: null },
                        { text: '✅ Faire une to-do list pour demain', dueDate: null },
                    ];

                    for (const todo of defaultTodos) {
                        await query(
                            `INSERT INTO todos (user_id, text, due_date)
                             VALUES ($1, $2, $3)`,
                            [userId, todo.text, todo.dueDate]
                        );
                    }

                    return true;

                } catch (error) {
                    console.error('❌ SignIn error:', error);
                    return false;
                }
            }
            return true;
        },

        async session({ session, token }): Promise<Session> {
            if (session.user && token.email) {
                try {
                    const user = await query(
                        'SELECT id, email, name, avatar_url, xp_points, level, role FROM users WHERE email = $1 AND is_active = true',
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
                        session.user.role = userData.role || 'student';
                    } else {
                        session.user.id = token.userId || '';
                        session.user.xp_points = 0;
                        session.user.level = 1;
                        session.user.avatar_url = token.picture || '';
                        session.user.email = token.email || '';
                        session.user.name = token.name || '';
                        session.user.role = 'student';
                    }
                } catch (error) {
                    console.error('Session error (non-fatal):', error);
                    session.user.id = token.userId || '';
                    session.user.xp_points = 0;
                    session.user.level = 1;
                    session.user.avatar_url = token.picture || '';
                    session.user.email = token.email || '';
                    session.user.name = token.name || '';
                    session.user.role = 'student';
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
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

