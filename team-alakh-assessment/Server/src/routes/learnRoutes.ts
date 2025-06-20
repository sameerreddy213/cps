//developed by :@Aditya Chandra Das and Alakh Mathur
import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import LearningHistory from '../models/LearningHistory';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';

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

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
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
    return data.candidates[0].content.parts[0].text;
  } catch {
    return `
Welcome to learning ${topic}!

${topic} is an important subject that forms the foundation for many advanced concepts...
(placeholder fallback content)
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
    "id": "[module-1-unique-id]",
    "title": "[Module Title]",
    "content": "[Learning content here...]",
    "duration": "[15 min]",
    "type": "[text]"
  }
]

Make sure modules build upon each other logically.
Ensure 'id' is a unique string for each module.

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
    let modules: any[];

    try {
      modules = JSON.parse(cleaned);
      if (!Array.isArray(modules)) throw new Error("Not an array.");
    } catch {
      modules = [];
    }

    const completedModules = await LearningHistory.find({ userEmail, topic, completed: true });
    const completedModuleIds = completedModules.map(h => h.moduleId);

    return modules.map((module: any) => ({
      id: module.id || crypto.randomUUID(),
      title: module.title || 'Untitled Module',
      content: module.content || 'No content.',
      duration: module.duration || 'N/A',
      type: module.type || 'text',
      downloadUrl: `/api/learn/download/${encodeURIComponent(topic)}/${module.id || crypto.randomUUID()}`,
      completed: completedModuleIds.includes(module.id)
    }));

  } catch {
    return [
      {
        id: "intro-fallback",
        title: `Introduction to ${topic}`,
        content: `Fallback module.`,
        duration: "20 min",
        type: "text",
        downloadUrl: `/api/learn/download/${encodeURIComponent(topic)}/intro-fallback`,
        completed: false
      }
    ];
  }
}

router.get('/:topic', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const content = await generateLearningContent(topic);
    res.json({ content });
  } catch {
    res.status(500).json({ message: 'Failed to generate learning content' });
  }
});

router.get('/:topic/modules', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;
    const modules = await generateLearningModules(topic, userEmail);
    res.json({ modules });
  } catch {
    res.status(500).json({ message: 'Failed to generate learning modules' });
  }
});

router.get('/history/:topic', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;
    const history = await LearningHistory.find({ userEmail, topic }).sort({ completedAt: -1 });
    res.json({ history });
  } catch {
    res.status(500).json({ message: 'Failed to fetch learning history' });
  }
});

router.post('/complete-module', authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic, moduleId } = req.body;
    const userEmail = req.user.email;
    const existing = await LearningHistory.findOne({ userEmail, topic, moduleId });

    if (!existing) {
      const newHistory = new LearningHistory({ userEmail, topic, moduleId, completed: true, completedAt: new Date() });
      await newHistory.save();
    } else if (!existing.completed) {
      existing.completed = true;
      existing.completedAt = new Date();
      await existing.save();
    }

    res.json({ message: 'Module marked as completed' });
  } catch {
    res.status(500).json({ message: 'Failed to mark module as complete' });
  }
});

router.get('/download/:topic/:moduleId', authenticateToken, async (req: Request, res: Response) => {
  const { topic, moduleId } = req.params;
  let moduleTitle = `Module ${moduleId}`;
  let moduleActualContent = `Content for module "${moduleId}" on "${topic}" could not be retrieved.`;

  try {
    const token = req.headers.authorization;
    const apiBaseUrl = process.env.YOUR_API_BASE_URL || `http://localhost:5000`;

    const modulesResponse = await fetch(`${apiBaseUrl}/api/learn/${encodeURIComponent(topic!)}/modules`, {
      headers: { 'Authorization': token as string }
    });

    const modulesData = await modulesResponse.json();
    if (modulesData && Array.isArray(modulesData.modules)) {
      const targetModule = modulesData.modules.find((m: LearningModule) => m.id === moduleId);
      if (targetModule) {
        moduleActualContent = targetModule.content;
        moduleTitle = targetModule.title;
      }
    }

    const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 60, right: 60 }
});
let buffers: Buffer[] = [];

doc.on('data', buffers.push.bind(buffers));
doc.on('end', () => {
  const pdfBuffer = Buffer.concat(buffers);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${moduleTitle.replace(/\s/g, '_')}.pdf"`);
  res.send(pdfBuffer);
});

// === 📌 Add logo (top-left corner) ===
try {
  doc.image('src/logo.png', doc.page.margins.left, doc.page.margins.top - 20, {
    width: 100,
    height: 40
  });
} catch (logoError) {
  if (logoError && typeof logoError === 'object' && 'message' in logoError) {
    console.warn('⚠️ Logo could not be loaded. Skipping logo section:', (logoError as { message: string }).message);
  } else {
    console.warn('⚠️ Logo could not be loaded. Skipping logo section:', logoError);
  }
}

doc.moveDown(2);

doc.fillColor('#1E88E5')
  .fontSize(26)
  .font('Helvetica-Bold')
  .text(`Learning Material: ${topic}`, { align: 'center' });

doc.moveDown(0.5);

doc.fillColor('black')
  .fontSize(18)
  .font('Helvetica-Bold')
  .text(`Module: ${moduleTitle}`, { align: 'center' });

doc.moveDown(1);

doc.strokeColor('#BDBDBD')
  .lineWidth(1)
  .moveTo(doc.page.margins.left, doc.y)
  .lineTo(doc.page.width - doc.page.margins.right, doc.y)
  .stroke();

doc.moveDown(1);

const finalContentForPdf = moduleActualContent.trim();

if (finalContentForPdf.length > 0 && !finalContentForPdf.includes('could not be retrieved')) {
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('black')
    .text(finalContentForPdf, {
      align: 'justify',
      lineGap: 4
    });
} else {
  doc.fontSize(12)
    .font('Helvetica-Oblique')
    .fillColor('red')
    .text(`No detailed content was available for this module. Please check the website or contact support.`, {
      align: 'center'
    });
}

doc.moveDown(2);

doc.fontSize(10)
  .fillColor('gray')
  .text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, { align: 'right' });

const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(8)
    .fillColor('gray')
    .text(`Page ${i + 1} of ${range.count}`, doc.page.margins.left, doc.page.height - 40, {
      align: 'center'
    });
}

doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

export default router;
