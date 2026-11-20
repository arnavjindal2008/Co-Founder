import express from 'express';

import {
    getMessages,
    sendMessage,
    markMessagesAsRead
} from '../controllers/messageController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:conversationId', getMessages);
router.post('/:conversationId', sendMessage);
router.patch('/:conversationId/read', markMessagesAsRead);

export default router;
