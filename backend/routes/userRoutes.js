import express from 'express';
import { discoverUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All user discovery routes require login
router.use(authMiddleware);

// GET /api/users/discover
router.get('/discover', discoverUsers);

export default router;
