// Author: Sai Lokesh, Mondi
import express from 'express';
import {
  submitExamResult,
  getUserExamResults,
  getTopicExamResults,
  // getExamResultById, // Uncomment if implemented in controller
} from '../controllers/examResultController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, submitExamResult);
router.get('/user', auth, getUserExamResults);
router.get('/topic/:topicId', auth, getTopicExamResults);
// router.get('/:id', auth, getExamResultById); // Uncomment if implemented

export default router;
