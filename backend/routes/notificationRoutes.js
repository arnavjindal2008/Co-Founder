import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(authMiddleware);

// Get all notifications
router.get('/', getNotifications);

// Get unread notifications
router.get('/unread', getUnreadNotifications);

// Get unread count
router.get('/unread/count', getUnreadCount);

// Mark all as read
router.patch('/read-all', markAllNotificationsAsRead);

// Mark one as read
router.patch('/:notificationId/read', markNotificationAsRead);

// Delete one notification
router.delete('/:notificationId', deleteNotification);

export default router;