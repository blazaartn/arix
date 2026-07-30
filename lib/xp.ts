import { query } from './db';

export const XP_RULES = {
    ASK_QUESTION: 50,        // ✅ Changed from 10 to 50
    ANSWER_QUESTION: 25,
    ACCEPTED_ANSWER: 50,
    LIKE_RECEIVED: 5,
    COMMENT: 10,
    REPLY: 10,
};

export async function addXP(
    userId: string,
    amount: number,
    actionType: string,
    referenceId?: string,
    description?: string
): Promise<void> {
    if (!userId || !actionType) {
        console.warn('⚠️ Skipping XP: Missing userId or actionType');
        return;
    }

    try {
        await query(
            `INSERT INTO xp_transactions (user_id, xp_amount, action_type, reference_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, amount, actionType, referenceId || null, description || null]
        );

        const result = await query(
            'UPDATE users SET xp_points = xp_points + $1 WHERE id = $2 RETURNING xp_points',
            [amount, userId]
        );

        if (result.rows.length === 0) {
            console.warn('⚠️ User not found for XP update:', userId);
            return;
        }

        const newXP = result.rows[0].xp_points;
        const newLevel = calculateLevel(newXP);

        await query(
            'UPDATE users SET level = $1 WHERE id = $2',
            [newLevel, userId]
        );

        // Trigger rank recalculation (debounced in background)
        // This is called less frequently to avoid excessive queries
        triggerRankUpdate().catch(() => {});

    } catch (error) {
        console.warn('⚠️ XP error (non-fatal):', error);
    }
}

// Debounced rank update - recalculates all user ranks
let rankUpdateTimeout: NodeJS.Timeout | null = null;
async function triggerRankUpdate(): Promise<void> {
    if (rankUpdateTimeout) {
        clearTimeout(rankUpdateTimeout);
    }
    
    // Debounce: only run once per 30 seconds
    rankUpdateTimeout = setTimeout(async () => {
        try {
            await query(`
                WITH ranked_users AS (
                    SELECT id, ROW_NUMBER() OVER (ORDER BY xp_points DESC, id) as rank
                    FROM users
                    WHERE is_active = true AND xp_points > 0
                )
                UPDATE users u SET user_rank = ranked_users.rank
                FROM ranked_users
                WHERE u.id = ranked_users.id
            `);
        } catch (error) {
            console.warn('⚠️ Rank update error (non-fatal):', error);
        }
        rankUpdateTimeout = null;
    }, 30000); // Wait 30 seconds before recalculating
}

export function calculateLevel(xp: number): number {
    const levels = [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000, 8000, 10000, 15000, 20000];
    let level = 1;
    for (let i = 1; i < levels.length; i++) {
        if (xp >= levels[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
}

export function getXPForLevel(level: number): number {
    const levels: { [key: number]: number } = {
        1: 0,
        2: 100,
        3: 300,
        4: 600,
        5: 1000,
        6: 1600,
        7: 2400,
        8: 3400,
        9: 4600,
        10: 6000,
        11: 8000,
        12: 10000,
        13: 15000,
        14: 20000,
    };
    return levels[level] || 0;
}

export function getXPProgress(xp: number, level: number): number {
    const currentLevelXP = getXPForLevel(level);
    const nextLevelXP = getXPForLevel(level + 1);
    
    if (nextLevelXP === currentLevelXP) return 100;
    
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(Math.max(progress, 0), 100);
}
