import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { getMatches } from '../controllers/matchingController.js';

const router = express.Router();

router.use(authMiddleware);

// GET potential co-founder matches
router.get('/', getMatches);

export default router;