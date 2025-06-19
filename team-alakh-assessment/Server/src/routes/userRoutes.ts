import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface JwtPayload {
  email: string;
}

// GET /api/user/passed
router.get('/passed', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ passed: user.passedArray, email: user.email });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

export default router;
