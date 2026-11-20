import pool from '../config/db.js';

// GET: All notifications of logged-in user
export const getNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                n.id,
                n.user_id,
                n.actor_id,
                n.notification_type,
                n.message,
                n.is_read,
                n.created_at,
                p.full_name AS actor_name,
                p.profile_picture AS actor_profile_picture
             FROM notifications n
             LEFT JOIN profiles p ON p.user_id = n.actor_id
             WHERE n.user_id = $1
             ORDER BY n.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            notifications: result.rows
        });

    } catch (error) {
        console.error('Get notifications error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications.'
        });
    }
};

// GET: Only unread notifications
export const getUnreadNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                n.id,
                n.actor_id,
                n.notification_type,
                n.message,
                n.is_read,
                n.created_at,
                p.full_name AS actor_name,
                p.profile_picture AS actor_profile_picture
             FROM notifications n
             LEFT JOIN profiles p ON p.user_id = n.actor_id
             WHERE n.user_id = $1
             AND n.is_read = FALSE
             ORDER BY n.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            notifications: result.rows
        });

    } catch (error) {
        console.error('Get unread notifications error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch unread notifications.'
        });
    }
};

// GET: Count unread notifications
export const getUnreadCount = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS unread_count
             FROM notifications
             WHERE user_id = $1
             AND is_read = FALSE`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            unreadCount: Number(result.rows[0].unread_count)
        });

    } catch (error) {
        console.error('Get unread count error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch unread notification count.'
        });
    }
};

// PATCH: Mark one notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = Number(req.params.notificationId);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notification ID.'
            });
        }

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1
             AND user_id = $2
             RETURNING id, is_read`,
            [notificationId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            notification: result.rows[0]
        });

    } catch (error) {
        console.error('Mark notification as read error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update notification.'
        });
    }
};

// PATCH: Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE user_id = $1
             AND is_read = FALSE`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read.',
            updatedCount: result.rowCount
        });

    } catch (error) {
        console.error('Mark all notifications as read error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update notifications.'
        });
    }
};

// DELETE: Delete one notification
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = Number(req.params.notificationId);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notification ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM notifications
             WHERE id = $1
             AND user_id = $2
             RETURNING id`,
            [notificationId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully.'
        });

    } catch (error) {
        console.error('Delete notification error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete notification.'
        });
    }
};