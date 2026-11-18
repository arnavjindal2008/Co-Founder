import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/mine', getMyProjects);
router.delete('/:id', deleteProject);

export default router;