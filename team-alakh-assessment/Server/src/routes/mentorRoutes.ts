import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface CustomJwtPayload extends jwt.JwtPayload {
  email: string;
}

// Helper to get user from JWT
async function getUserFromToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    const user = await User.findOne({ email: decoded.email });
    return user;
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

// GET /api/mentor/all - Mentors can see all learners
router.get('/all', async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied: Mentor role required' });
  }

  try {
    const learners = await User.find({ role: 'learner' }).select('-password');
    res.status(200).json(learners);
  } catch (error) {
    console.error('Error fetching learners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/mentor/:email - Mentor can see a specific learner's profile
router.get('/:email', async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied: Mentor role required' });
  }

  try {
    const learner = await User.findOne({ email: req.params.email }).select('-password');
    if (!learner || learner.role !== 'learner') {
      return res.status(404).json({ message: 'Learner not found' });
    }

    res.json(learner);
  } catch (error) {
    console.error('Error fetching learner profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
