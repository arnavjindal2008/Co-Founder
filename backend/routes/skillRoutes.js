import express from 'express';
import {
    getAllSkills,
    getMySkills,
    addSkill,
    deleteSkill
} from '../controllers/skillController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all available skills
router.get('/', getAllSkills);

// Get logged-in user's skills
router.get('/my', authMiddleware, getMySkills);

// Add a skill to logged-in user's profile
router.post('/', authMiddleware, addSkill);

// Remove a skill from logged-in user's profile
router.delete('/:skillId', authMiddleware, deleteSkill);

export default router;