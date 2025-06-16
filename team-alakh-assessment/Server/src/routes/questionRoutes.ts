//developed by :@Pavithra Krishnappa
/*import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  questions: Question[];
}

// Middleware to verify JWT token
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function generateQuizQuestions(topic: string): Promise<Question[]> {
  const prompt = `
Generate exactly 10 multiple choice questions about "${topic}".
Each question should have exactly 4 options and indicate which option is correct (0-3).
Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

Make sure:
- Questions are relevant to ${topic}
- Questions test understanding, not just memorization
- Options are plausible but only one is clearly correct
- Difficulty is appropriate for someone learning ${topic}
- Response is valid JSON without any markdown formatting
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response - remove markdown code blocks if present
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON
    const questions = JSON.parse(cleaned);
    
    // Validate the structure
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid question format or count');
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
    });

    return questions;
  } catch (error: any) {
    console.error("❌ Quiz generation error:", error);
    // Return fallback questions if AI generation fails
    return [
      {
        question: `What is a fundamental concept in ${topic}?`,
        options: ["Basic understanding", "Advanced theory", "Complex implementation", "Expert knowledge"],
        correct: 0
      },
      {
        question: `Which approach is commonly used in ${topic}?`,
        options: ["Random approach", "Systematic approach", "Chaotic approach", "Undefined approach"],
        correct: 1
      },
      {
        question: `What is the primary benefit of learning ${topic}?`,
        options: ["No benefit", "Confusion", "Better understanding", "More complexity"],
        correct: 2
      },
      {
        question: `How should one start learning ${topic}?`,
        options: ["Jump to advanced topics", "Skip fundamentals", "Ignore prerequisites", "Start with basics"],
        correct: 3
      },
      {
        question: `What is important when studying ${topic}?`,
        options: ["Practice and understanding", "Memorization only", "Skipping examples", "Avoiding questions"],
        correct: 0
      },
      {
        question: `Which resource is most helpful for ${topic}?`,
        options: ["Outdated materials", "Comprehensive guides", "Random articles", "Unrelated content"],
        correct: 1
      },
      {
        question: `What indicates mastery of ${topic}?`,
        options: ["Confusion about basics", "Inability to explain", "Clear understanding and application", "Memorizing definitions"],
        correct: 2
      },
      {
        question: `How can you improve your knowledge of ${topic}?`,
        options: ["Avoid practice", "Skip difficult parts", "Ignore feedback", "Regular practice and review"],
        correct: 3
      },
      {
        question: `What is a common mistake when learning ${topic}?`,
        options: ["Rushing through fundamentals", "Taking time to understand", "Asking questions", "Practicing regularly"],
        correct: 0
      },
      {
        question: `What should you do after learning ${topic}?`,
        options: ["Forget everything", "Apply knowledge practically", "Avoid related topics", "Stop learning"],
        correct: 1
      }
    ];
  }
}

// GET /api/question/generate/:topic - Generate quiz questions for a topic
router.get('/generate/:topic', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const questions = await generateQuizQuestions(topic);
    
    res.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz questions' });
  }
});

// POST /api/question/submit/:topic - Submit quiz answers and update user progress
router.post('/submit/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const { answers, cheatingDetected } = req.body;
    const userEmail = req.user.email;

    // If cheating was detected, automatically fail
    if (cheatingDetected) {
      return res.json({ 
        score: 0, 
        passed: false, 
        message: 'Quiz terminated due to suspicious activity' 
      });
    }

    // Generate the same questions to check answers
    const questions = await generateQuizQuestions(topic);
    
    // Calculate score
    let correctAnswers = 0;
    answers.forEach((answer: number, index: number) => {
      if (index < questions.length && answer === questions[index].correct) {
        correctAnswers++;
      }
    });

    const passed = correctAnswers >= 7; // Need 7/10 to pass

    // Update user's passed array if they passed
    if (passed) {
      const user = await User.findOne({ email: userEmail });
      if (user && !user.passedArray.includes(topic)) {
        user.passedArray.push(topic);
        await user.save();
      }
    }

    res.json({ 
      score: correctAnswers, 
      passed,
      message: passed ? 'Congratulations! You passed the quiz.' : 'You need 7/10 to pass. Try again!'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

export default router;
*/
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import QuizSession from '../models/QuizSession';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  questions: Question[];
}

// Middleware to verify JWT token
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function generateQuizQuestions(topic: string): Promise<Question[]> {
  const prompt = `
Generate exactly 10 multiple choice questions about "${topic}".
Each question should have exactly 4 options and indicate which option is correct (0-3).
Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

Make sure:
- Questions are relevant to ${topic}
- Questions test understanding, not just memorization
- Options are plausible but only one is clearly correct
- Difficulty is appropriate for someone learning ${topic}
- Response is valid JSON without any markdown formatting
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response - remove markdown code blocks if present
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON
    const questions = JSON.parse(cleaned);
    
    // Validate the structure
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid question format or count');
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
    });

    return questions;
  } catch (error: any) {
    console.error("❌ Quiz generation error:", error);
    // Return fallback questions if AI generation fails
    return [
      {
        question: `What is a fundamental concept in ${topic}?`,
        options: ["Basic understanding", "Advanced theory", "Complex implementation", "Expert knowledge"],
        correct: 0
      },
      {
        question: `Which approach is commonly used in ${topic}?`,
        options: ["Random approach", "Systematic approach", "Chaotic approach", "Undefined approach"],
        correct: 1
      },
      {
        question: `What is the primary benefit of learning ${topic}?`,
        options: ["No benefit", "Confusion", "Better understanding", "More complexity"],
        correct: 2
      },
      {
        question: `How should one start learning ${topic}?`,
        options: ["Jump to advanced topics", "Skip fundamentals", "Ignore prerequisites", "Start with basics"],
        correct: 3
      },
      {
        question: `What is important when studying ${topic}?`,
        options: ["Practice and understanding", "Memorization only", "Skipping examples", "Avoiding questions"],
        correct: 0
      },
      {
        question: `Which resource is most helpful for ${topic}?`,
        options: ["Outdated materials", "Comprehensive guides", "Random articles", "Unrelated content"],
        correct: 1
      },
      {
        question: `What indicates mastery of ${topic}?`,
        options: ["Confusion about basics", "Inability to explain", "Clear understanding and application", "Memorizing definitions"],
        correct: 2
      },
      {
        question: `How can you improve your knowledge of ${topic}?`,
        options: ["Avoid practice", "Skip difficult parts", "Ignore feedback", "Regular practice and review"],
        correct: 3
      },
      {
        question: `What is a common mistake when learning ${topic}?`,
        options: ["Rushing through fundamentals", "Taking time to understand", "Asking questions", "Practicing regularly"],
        correct: 0
      },
      {
        question: `What should you do after learning ${topic}?`,
        options: ["Forget everything", "Apply knowledge practically", "Avoid related topics", "Stop learning"],
        correct: 1
      }
    ];
  }
}

// GET /api/question/generate/:topic - Generate quiz questions for a topic and store in session
router.get('/generate/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;

    // Check if there's an existing active session
    let existingSession = await QuizSession.findOne({ 
      userEmail, 
      topic, 
      completed: false 
    });

    if (existingSession) {
      // Return existing session questions
      return res.json({ questions: existingSession.questions });
    }

    // Generate new questions
    const questions = await generateQuizQuestions(topic);
    
    // Create new quiz session
    const newSession = new QuizSession({
      userEmail,
      topic,
      questions,
      userAnswers: [],
      completed: false
    });

    await newSession.save();
    
    res.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz questions' });
  }
});

// POST /api/question/submit/:topic - Submit quiz answers and update user progress
router.post('/submit/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const { answers, cheatingDetected } = req.body;
    const userEmail = req.user.email;

    // Find the active quiz session
    const session = await QuizSession.findOne({ 
      userEmail, 
      topic, 
      completed: false 
    });

    if (!session) {
      return res.status(404).json({ message: 'No active quiz session found' });
    }

    // If cheating was detected, automatically fail
    if (cheatingDetected) {
      session.userAnswers = answers;
      session.score = 0;
      session.passed = false;
      session.completed = true;
      await session.save();

      return res.json({ 
        score: 0, 
        passed: false, 
        message: 'Quiz terminated due to suspicious activity' 
      });
    }

    // Calculate score using the stored questions
    let correctAnswers = 0;
    answers.forEach((answer: number, index: number) => {
      if (index < session.questions.length && answer === session.questions[index].correct) {
        correctAnswers++;
      }
    });

    const passed = correctAnswers >= 7; // Need 7/10 to pass

    // Update session with results
    session.userAnswers = answers;
    session.score = correctAnswers;
    session.passed = passed;
    session.completed = true;
    await session.save();

    // Update user's passed array if they passed
    if (passed) {
      const user = await User.findOne({ email: userEmail });
      if (user && !user.passedArray.includes(topic)) {
        user.passedArray.push(topic);
        await user.save();
      }
    }

    res.json({ 
      score: correctAnswers, 
      passed,
      message: passed ? 'Congratulations! You passed the quiz.' : 'You need 7/10 to pass. Try again!'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// GET /api/question/session/:topic - Get current quiz session for evaluation
router.get('/session/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;

    const session = await QuizSession.findOne({ 
      userEmail, 
      topic, 
      completed: true 
    }).sort({ createdAt: -1 }); // Get the most recent completed session

    if (!session) {
      return res.status(404).json({ message: 'No completed quiz session found' });
    }

    res.json({ 
      questions: session.questions,
      userAnswers: session.userAnswers,
      score: session.score,
      passed: session.passed
    });
  } catch (error) {
    console.error('Error fetching quiz session:', error);
    res.status(500).json({ message: 'Failed to fetch quiz session' });
  }
});

// DELETE /api/question/cleanup/:topic - Clean up quiz session when user leaves
router.delete('/cleanup/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;

    // Only delete incomplete sessions (completed ones are kept for evaluation)
    await QuizSession.deleteMany({ 
      userEmail, 
      topic, 
      completed: false 
    });

    res.json({ message: 'Quiz session cleaned up' });
  } catch (error) {
    console.error('Error cleaning up quiz session:', error);
    res.status(500).json({ message: 'Failed to clean up quiz session' });
  }
});

export default router;