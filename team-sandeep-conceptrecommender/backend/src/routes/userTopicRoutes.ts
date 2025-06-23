//Author: Pentapati V V Satya Pavan Sandeep
import express from 'express';
import { selectTopics, getUserTopics, updateTopicProgress } from '../controllers/userTopicController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Select topics after signup
router.post('/select', auth, selectTopics);

// Get user's selected topics
router.get('/', auth, getUserTopics);

// Update topic progress
router.patch('/:topicId/progress', auth, updateTopicProgress);

export default router;
