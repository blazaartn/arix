import { query } from './db';

export const XP_RULES = {
    ASK_QUESTION: 10,
    ANSWER_QUESTION: 15,
    ACCEPTED_ANSWER: 25,
    LIKE_RECEIVED: 1,
    COMMENT: 2,
    REPLY: 2,
};

export async function addXP(
    userId: string, 
    amount: number, 
    actionType: string,
    referenceId?: string,
    description?: string
): Promise<void> {
    try {
        // Insert transaction
        await query(
            `INSERT INTO xp_transactions (user_id, xp_amount, action_type, reference_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, amount, actionType, referenceId || null, description || null]
        );

        // Update user XP
        const result = await query(
            'UPDATE users SET xp_points = xp_points + $1 WHERE id = $2 RETURNING xp_points',
            [amount, userId]
        );

        const newXP = result.rows[0]?.xp_points || 0;
        const newLevel = calculateLevel(newXP);

        await query(
            'UPDATE users SET level = $1 WHERE id = $2',
            [newLevel, userId]
        );

    } catch (error) {
        // ⚠️ DON'T THROW - just log the error
        console.error('Error adding XP (non-fatal):', error);
        // The question will still be created
    }
}

export function calculateLevel(xp: number): number {
    const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000];
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