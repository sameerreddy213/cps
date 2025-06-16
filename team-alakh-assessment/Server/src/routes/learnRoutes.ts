//developed by :@Aditya Chandra Das
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import LearningHistory from '../models/LearningHistory';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

interface LearningModule {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'text' | 'video' | 'interactive';
  downloadUrl?: string;
  completed: boolean;
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

async function generateLearningContent(topic: string): Promise<string> {
  const prompt = `
Create comprehensive learning content for the topic "${topic}".
The content should be:
- Educational and well-structured
- Include key concepts, definitions, and explanations
- Provide examples where relevant
- Be suitable for someone learning ${topic} for the first time
- Include practical applications and use cases
- Be engaging and easy to understand
- Around 800-1200 words

Format the response as clean text with proper paragraphs and structure.
Do not use markdown formatting - just plain text with line breaks for paragraphs.
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
    const content = data.candidates[0].content.parts[0].text;
    
    return content;
  } catch (error: any) {
    console.error("❌ Content generation error:", error);
    return `
Welcome to learning ${topic}!

${topic} is an important subject that forms the foundation for many advanced concepts. Understanding ${topic} will help you build a strong knowledge base and prepare you for more complex topics.

Key Concepts:
The fundamental principles of ${topic} involve understanding its core components and how they work together. This includes learning the basic terminology, understanding the underlying mechanisms, and recognizing common patterns and applications.

Practical Applications:
${topic} has many real-world applications across various fields. By mastering these concepts, you'll be able to apply this knowledge to solve practical problems and understand more advanced topics that build upon these foundations.

Learning Approach:
To effectively learn ${topic}, it's recommended to:
1. Start with the basic concepts and definitions
2. Work through examples and practice problems
3. Apply the knowledge to real-world scenarios
4. Review and reinforce your understanding regularly

Next Steps:
Once you've mastered the fundamentals of ${topic}, you'll be ready to explore more advanced topics and applications. Take the quiz to test your understanding and demonstrate your knowledge of these important concepts.

Remember, learning is a process, and mastering ${topic} takes time and practice. Don't hesitate to review the material multiple times and seek additional resources if needed.
    `;
  }
}

async function generateLearningModules(topic: string, userEmail: string): Promise<LearningModule[]> {
  const prompt = `
Generate a structured learning sequence for "${topic}" with 5-7 learning modules.
Each module should have:
- A clear title
- Learning content (200-300 words)
- Estimated duration
- Type (text, video, or interactive)

Format as JSON array:
[
  {
    "id": "module-1",
    "title": "Module Title",
    "content": "Learning content here...",
    "duration": "15 min",
    "type": "text",
    "downloadUrl": "/downloads/module-1.pdf"
  }
]

Make sure modules build upon each other logically.
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
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const modules = JSON.parse(cleaned);

    // Check completion status from database
    const completedModules = await LearningHistory.find({ 
      userEmail, 
      topic, 
      completed: true 
    });
    
    const completedModuleIds = completedModules.map(h => h.moduleId);

    return modules.map((module: any) => ({
      ...module,
      completed: completedModuleIds.includes(module.id)
    }));

  } catch (error: any) {
    console.error("❌ Module generation error:", error);
    return [
      {
        id: "intro",
        title: `Introduction to ${topic}`,
        content: `Welcome to ${topic}! This module covers the basic concepts and foundations you need to understand before diving deeper.`,
        duration: "20 min",
        type: "text" as const,
        downloadUrl: `/downloads/${topic.toLowerCase()}-intro.pdf`,
        completed: false
      },
      {
        id: "fundamentals",
        title: `${topic} Fundamentals`,
        content: `Learn the core principles and fundamental concepts that form the backbone of ${topic}.`,
        duration: "30 min",
        type: "text" as const,
        downloadUrl: `/downloads/${topic.toLowerCase()}-fundamentals.pdf`,
        completed: false
      },
      {
        id: "practical",
        title: `Practical Applications`,
        content: `Explore real-world applications and examples of how ${topic} is used in practice.`,
        duration: "25 min",
        type: "interactive" as const,
        completed: false
      }
    ];
  }
}

// GET /api/learn/:topic - Get learning content for a topic
router.get('/:topic', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const content = await generateLearningContent(topic);
    
    res.json({ content });
  } catch (error) {
    console.error('Error generating learning content:', error);
    res.status(500).json({ message: 'Failed to generate learning content' });
  }
});

// GET /api/learn/:topic/modules - Get learning modules for a topic
router.get('/:topic/modules', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;
    const modules = await generateLearningModules(topic, userEmail);
    
    res.json({ modules });
  } catch (error) {
    console.error('Error generating learning modules:', error);
    res.status(500).json({ message: 'Failed to generate learning modules' });
  }
});

// GET /api/learn/history/:topic - Get learning history for a topic
router.get('/history/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;
    
    const history = await LearningHistory.find({ userEmail, topic }).sort({ completedAt: -1 });
    
    res.json({ history });
  } catch (error) {
    console.error('Error fetching learning history:', error);
    res.status(500).json({ message: 'Failed to fetch learning history' });
  }
});

// POST /api/learn/complete-module - Mark a module as completed
router.post('/complete-module', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic, moduleId } = req.body;
    const userEmail = req.user.email;
    
    // Check if already completed
    const existing = await LearningHistory.findOne({ userEmail, topic, moduleId });
    
    if (!existing) {
      const newHistory = new LearningHistory({
        userEmail,
        topic,
        moduleId,
        completed: true,
        completedAt: new Date()
      });
      await newHistory.save();
    } else if (!existing.completed) {
      existing.completed = true;
      existing.completedAt = new Date();
      await existing.save();
    }
    
    res.json({ message: 'Module marked as completed' });
  } catch (error) {
    console.error('Error marking module as complete:', error);
    res.status(500).json({ message: 'Failed to mark module as complete' });
  }
});

// GET /api/learn/download/:topic/:moduleId - Download learning material
router.get('/download/:topic/:moduleId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic, moduleId } = req.params;
    
    // Generate PDF content (simplified - in production, you'd generate actual PDFs)
    const pdfContent = `Learning Material for ${topic} - Module ${moduleId}
    
This is a downloadable learning resource for ${topic}.
Content would include detailed explanations, examples, and exercises.

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${topic}-${moduleId}.pdf"`);
    res.send(Buffer.from(pdfContent));
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).json({ message: 'Failed to download material' });
  }
});

export default router;