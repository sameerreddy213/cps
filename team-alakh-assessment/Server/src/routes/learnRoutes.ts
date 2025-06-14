//developed by :@PavithraKrishnappa
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware to verify JWT token
//correction completed
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

export default router;