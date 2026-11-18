import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  getAllInterests,
  getMyInterests,
  addInterest,
  removeInterest,
} from '../controllers/interestController.js';

const router = express.Router();

// Public: get all available interests
router.get('/', getAllInterests);

// Protected: get logged-in user's interests
router.get('/my', authMiddleware, getMyInterests);

// Protected: add an interest
router.post('/', authMiddleware, addInterest);

// Protected: remove an interest
router.delete('/:interestId', authMiddleware, removeInterest);

export default router;