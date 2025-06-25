import express, { Request, Response } from 'express';
import LearningModule from '../models/LearningModule';
import Prerequisite from '../models/Prerequisite';

const router = express.Router();

// GET /api/topics
router.get('/', async (req: Request, res: Response) => {
  try {
    const modules = await LearningModule.find();
    const prereqs = await Prerequisite.find();
    // Map topic to prerequisites
    const prereqMap: Record<string, string[]> = {};
    prereqs.forEach((pr: any) => {
      prereqMap[pr.topic] = pr.prerequisites;
    });
    // Build response
    const topics = modules.map((mod: any) => ({
      topic: mod.topic,
      modules: mod.modules,
      prerequisites: prereqMap[mod.topic] || [],
    }));
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

export default router; 