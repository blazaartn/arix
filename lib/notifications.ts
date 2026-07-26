import { query } from './db';

interface NotificationData {
    userId: string;
    actorId: string;
    type: 'like' | 'comment' | 'reply' | 'accepted' | 'question' | 'answer' | 'mention' | 'system';
    content: string;
    questionId?: string;
    commentId?: string;
    link?: string;
}

export async function createNotification(data: NotificationData): Promise<void> {
    try {
        // Don't notify yourself
        if (data.userId === data.actorId) return;

        await query(
            `INSERT INTO notifications (user_id, actor_id, type, content, question_id, comment_id, link)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                data.userId,
                data.actorId,
                data.type,
                data.content,
                data.questionId || null,
                data.commentId || null,
                data.link || null
            ]
        );
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
        [userId]
    );
    return parseInt(result.rows[0].count);
}