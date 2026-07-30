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
                    
                    // ✅ Check if user exists
                    const existingUser = await query(
                        'SELECT * FROM users WHERE email = $1',
                        [user.email]
                    );

                    if (existingUser.rows.length === 0) {
                        // ✅ New user - create with default role
                        const result = await query(
                            `INSERT INTO users (email, name, google_id, avatar_url, role)
                             VALUES ($1, $2, $3, $4, $5)
                             RETURNING id`,
                            [user.email, userName, googleId, avatarUrl, 'student']
                        );
                        
                        const userId = result.rows[0].id;
                        
                        // ✅ Add default todos for new user
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
                        
                        console.log(`✅ Added default todos for new user: ${user.email}`);
                    } else {
                        // ✅ Update existing user
                        await query(
                            `UPDATE users 
                             SET name = $1, google_id = $2, avatar_url = $3
                             WHERE email = $4`,
                            [userName, googleId, avatarUrl, user.email]
                        );
                    }
                    
                    return true;
                } catch (error) {
                    console.error('SignIn error:', error);
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
                        session.user.role = userData.role || 'student';
                    }
                } catch (error) {
                    console.error('Session error:', error);
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
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);