// NOTE: Type declaration errors for 'express', 'jsonwebtoken', 'dotenv', and 'process' are due to missing @types packages. Install them with:
// npm install --save-dev @types/express @types/jsonwebtoken @types/node
// These do not affect runtime if using JavaScript or transpiled TypeScript.
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import QuizSession from '../models/QuizSession';
import LearningModule from '../models/LearningModule';
import Prerequisite from '../models/Prerequisite';
import dotenv from 'dotenv';
import AssessmentHistory from '../models/AssessmentHistory';
import LearningHistory from '../models/LearningHistory';

dotenv.config();
const router = express.Router();

interface JwtPayload {
  email: string;
}
// Helper to get user from JWT
async function getUserFromToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });
    return user;
  } catch {
    return null;
  }
}

// Helper to add topic to user's search history
async function addToSearchHistory(userEmail: string, topic: string) {
  const user = await User.findOne({ email: userEmail });
  if (user) {
    // Ensure searchHistory field exists
    if (!user.searchHistory) {
      user.searchHistory = [];
    }
    // Add topic if not already present
    if (!user.searchHistory.includes(topic)) {
      user.searchHistory.push(topic);
      await user.save();
      console.log("Updated user search history:", user.searchHistory);
    }
  }
}

// GET /api/user/passed
router.get('/passed', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  res.json({ passed: user.passedArray, email: user.email, searchHistory: user.searchHistory || [] });
});

// GET /api/user/quiz-history
router.get('/quiz-history', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const sessions = await QuizSession.find({ userEmail: user.email, completed: true })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(sessions);
});

// GET /api/user/achievements
router.get('/achievements', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  res.json({ achievements: user.achievements || [] });
});

// GET /api/user/stats
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  // Use AssessmentHistory for quiz stats
  const assessments = await AssessmentHistory.find({ userEmail: user.email });
  const totalQuizzes = assessments.length;
  const avgScore = totalQuizzes > 0 ? (assessments.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / totalQuizzes) : 0;

  // Use both AssessmentHistory and LearningHistory for streaks and activity
  const quizDates = assessments.map((s: any) => new Date(s.createdAt));
  const learnings = await LearningHistory.find({ userEmail: user.email, $or: [ { completed: true }, { completedAt: { $exists: true } } ] });
  const learningDates = learnings.map((l: any) => l.completedAt ? new Date(l.completedAt) : new Date(l.createdAt));

  // Combine all activity dates (YYYY-MM-DD)
  const toLocalDateString = (date: Date | string) => {
    const d = new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  };
  const allDates = [...quizDates, ...learningDates].map(d => toLocalDateString(d));
  const uniqueDates = [...new Set(allDates)].sort();

  // Calculate current streak (consecutive days up to today)
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    if (!prevDate || (currentDate.getTime() - prevDate.getTime()) === 24 * 60 * 60 * 1000) {
      tempStreak++;
    } else if ((currentDate.getTime() - prevDate.getTime()) > 24 * 60 * 60 * 1000) {
      tempStreak = 1;
    }
    if (i === uniqueDates.length - 1 && (toLocalDateString(new Date()) === toLocalDateString(currentDate) || (new Date().getTime() - currentDate.getTime()) < 24 * 60 * 60 * 1000)) {
      currentStreak = tempStreak;
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    prevDate = currentDate;
  }

  // Calculate passed vs failed quizzes
  const passedQuizzes = assessments.filter((s: any) => s.passed).length;
  const failedQuizzes = totalQuizzes - passedQuizzes;

  // Calculate topics attempted
  const topicsAttempted = [...new Set(assessments.map((s: any) => s.topic))];

  res.json({ 
    totalQuizzes, 
    avgScore: Math.round(avgScore * 10) / 10, 
    currentStreak,
    maxStreak,
    passedQuizzes,
    failedQuizzes,
    topicsAttempted: topicsAttempted.length,
    totalTopics: user.passedArray?.length || 0
  });
});

// GET /api/user/recommendations
router.get('/recommendations', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  // Recommend topics where all prerequisites are passed but topic not yet passed
  const allPrereqs = await Prerequisite.find();
  const passed = user.passedArray || [];
  const recommended = allPrereqs.filter((pr: any) =>
    !passed.includes(pr.topic) &&
    pr.prerequisites.every((pre: string) => passed.includes(pre))
  ).map((pr: any) => pr.topic);
  res.json({ recommended });
});

// GET /api/user/profile
router.get('/profile', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  res.json({ email: user.email, profile: user.profile || {} });
});

// PUT /api/user/profile
router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const { name, picture } = req.body;
  user.profile = { ...user.profile, name: name || user.profile?.name, picture: picture || user.profile?.picture };
  await user.save();
  res.json({ success: true, profile: user.profile });
});

// POST /api/user/search-history
router.post('/search-history', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const { topic } = req.body;
  console.log("Adding topic to search history:", topic, "for user:", user.email);
  if (topic) {
    await addToSearchHistory(user.email, topic);
    console.log("Successfully added topic to search history");
  }
  res.json({ success: true });
});

// GET /api/user/search-history
router.get('/search-history', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  
  // Ensure searchHistory field exists
  if (!user.searchHistory) {
    user.searchHistory = [];
    await user.save();
  }
  
  console.log("Fetching search history for user:", user.email, "History:", user.searchHistory);
  res.json({ searchHistory: user.searchHistory || [] });
});

// GET /api/user/assessment-history
router.get('/assessment-history', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const history = await AssessmentHistory.find({ userEmail: user.email })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(history);
});

// GET /api/user/activity-calendar
router.get('/activity-calendar', async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const assessments = await AssessmentHistory.find({ userEmail: user.email });
  const quizDates = assessments.map((s: any) => new Date(s.createdAt));
  const learnings = await LearningHistory.find({ userEmail: user.email, $or: [ { completed: true }, { completedAt: { $exists: true } } ] });
  const learningDates = learnings.map((l: any) => l.completedAt ? new Date(l.completedAt) : new Date(l.createdAt));
  const toLocalDateString = (date: Date | string) => {
    const d = new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  };
  const allDates = [...quizDates, ...learningDates].map(d => toLocalDateString(d));
  const uniqueDates = [...new Set(allDates)].sort();
  res.json({ activityDates: uniqueDates });
});

export default router;
