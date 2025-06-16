<<<<<<< HEAD:team-parthan-assessment/backend/src/controllers/quizController.ts
import { Request, Response } from 'express';
import generateQuiz from '../services/generateQuiz';

export async function generate(req: Request, res: Response) {
  try {
    const { topic, prerequisites } = req.body;
    const quiz = await generateQuiz(topic, prerequisites);
    res.json({ quiz });
=======
// import generateQuiz from '../services/generateQuiz.js';
import { Request, Response, NextFunction } from "express";

export async function generate(req:Request, res:Response) {
  try {
    const { topic, prerequisites } = req.body;
    // const quiz = await generateQuiz(topic, prerequisites);
    // res.json({ quiz });
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/controllers/quizController.ts
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
}
