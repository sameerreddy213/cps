/*Author: Nakshatra Bhandary on 17/6/25*/
/*Updated by Nikita S Raj Kapini on 20/6/25*/
import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// ─── Register ────────────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1. Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // 2. Hash & save
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // 2. Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // 3. Sign token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── Change Password ──────────────────────────────────────────────────────────
router.post('/change-password', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error during password change' });
  }
});


export const authRoutes = router;
