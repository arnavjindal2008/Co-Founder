import express from 'express';

import {
    createConversation,
    getMyConversations
} from '../controllers/conversationController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyConversations);
router.post('/:userId', createConversation);

export default router;
