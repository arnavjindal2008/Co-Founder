import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', authMiddleware, createProject);

router.get('/', authMiddleware, getProjects);

router.get('/mine', authMiddleware, getMyProjects);

router.delete('/:id', authMiddleware, deleteProject);

export default router;