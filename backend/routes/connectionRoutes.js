import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
    sendConnectionRequest,
    getIncomingRequests,
    getOutgoingRequests,
    acceptConnectionRequest,
    rejectConnectionRequest,
    cancelConnectionRequest,
    getMyConnections
} from '../controllers/connectionController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', sendConnectionRequest);

router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);

router.get('/', getMyConnections);

router.patch('/:connectionId/accept', acceptConnectionRequest);
router.patch('/:connectionId/reject', rejectConnectionRequest);

router.delete('/:connectionId', cancelConnectionRequest);

export default router;
