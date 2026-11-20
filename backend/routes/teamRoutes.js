import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
    getProjectMembers,
    addProjectMember,
    updateMemberRole,
    removeProjectMember,
    leaveProject
} from '../controllers/teamController.js';

const router = express.Router();

router.use(authMiddleware);

// View project members
router.get('/:projectId/members', getProjectMembers);

// Add a member (project owner only)
router.post('/:projectId/members', addProjectMember);

// Update a member's role (project owner only)
router.patch('/:projectId/members/:userId', updateMemberRole);

// Remove a member (project owner only)
router.delete('/:projectId/members/:userId', removeProjectMember);

// Leave a project (logged-in member)
router.delete('/:projectId/leave', leaveProject);

export default router;