import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Define the shape of the request body for register and login
interface AuthRequestBody {
  email: string;
  password: string;
  role?: 'mentor' | 'learner'; // optional; default is 'learner'
}


// POST /api/auth/register
router.post('/register', async (req: Request<{}, {}, AuthRequestBody>, res: Response): Promise<void> => {
  const { email, password, role = 'learner' } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    if (!['mentor', 'learner'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role, passedArray: [] });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request<{}, {}, AuthRequestBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },  // include role in token
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/auth/verify
router.get('/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: JwtPayload | string | undefined) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    res.status(200).json({ message: 'Token is valid' });
  });
});

export default router;
