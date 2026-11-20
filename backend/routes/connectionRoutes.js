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

// All connection routes require authentication
router.use(authMiddleware);

// Send a request
router.post('/', sendConnectionRequest);

// View requests
router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);

// View accepted connections
router.get('/', getMyConnections);

// Accept or reject a request
router.patch('/:connectionId/accept', acceptConnectionRequest);
router.patch('/:connectionId/reject', rejectConnectionRequest);

// Cancel an outgoing request
router.delete('/:connectionId', cancelConnectionRequest);

export default router;