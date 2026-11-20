import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
    applyToProject,
    getMyApplications,
    getProjectApplications,
    updateApplicationStatus,
    withdrawApplication
} from '../controllers/applicationController.js';

const router = express.Router();

router.use(authMiddleware);

// Apply to a project
router.post('/projects/:projectId', applyToProject);

// View applications submitted by logged-in user
router.get('/my', getMyApplications);

// View applications received for an owned project
router.get('/projects/:projectId', getProjectApplications);

// Accept or reject an application
router.patch('/:applicationId/status', updateApplicationStatus);

// Withdraw your pending application
router.delete('/:applicationId', withdrawApplication);

export default router;