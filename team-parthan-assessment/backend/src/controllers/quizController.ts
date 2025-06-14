import { Request, Response } from 'express';
import generateQuiz from '../services/generateQuiz';

export async function generate(req: Request, res: Response) {
  try {
    const { topic, prerequisites } = req.body;
    const quiz = await generateQuiz(topic, prerequisites);
    res.json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
}
