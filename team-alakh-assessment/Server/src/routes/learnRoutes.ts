// developed by :@Aditya Chandra Das and Alakh Mathur
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import LearningHistory from "../models/LearningHistory";
import LearningModule from "../models/LearningModule";

dotenv.config();
const router = express.Router();

interface LearningModuleType {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "text" | "video" | "interactive";
  downloadUrl?: string;
  completed?: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];
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

async function generateLearningModules(topic: string): Promise<LearningModuleType[]> {
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
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();

    const modulesRaw = JSON.parse(cleaned);
    const modules = modulesRaw.map((m: any) => {
      const id = m.id || crypto.randomUUID();
      return {
        id,
        title: m.title || "Untitled Module",
        content: m.content || "No content",
        duration: m.duration || "N/A",
        type: m.type || "text",
        downloadUrl: `/api/learn/download/${encodeURIComponent(topic)}/${id}`,
      };
    });

    await LearningModule.create({ topic, modules });
    return modules;
  } catch (err) {
    console.error("Gemini error or parse fail:", err);
    return [
      {
        id: "fallback",
        title: `Intro to ${topic}`,
        content: "Fallback module content.",
        duration: "20 min",
        type: "text",
        downloadUrl: `/api/learn/download/${encodeURIComponent(topic)}/fallback`,
      },
    ];
  }
}

router.get("/:topic", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const existing = await LearningModule.findOne({ topic });
    if (existing && existing.modules.length > 0) {
      res.json({ content: existing.modules.map(m => m.content).join("\n\n") });
      return;
    } else {
      const generatedModules = await generateLearningModules(topic);
      const contentText = generatedModules.map(m => m.content).join("\n\n");
      res.json({ content: contentText });
      return;
    }
  } catch {
    res.status(500).json({ message: "Failed to generate or fetch content" });
  }
});

router.get("/:topic/modules", authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;

    let topicDoc = await LearningModule.findOne({ topic });
    if (!topicDoc) {
      const modules = await generateLearningModules(topic);
      topicDoc = await LearningModule.findOne({ topic }); // refetch after creation
    }

    if (!topicDoc) {
      res.status(404).json({ message: "Topic not found" });
      return;
    }

    const history = await LearningHistory.find({ userEmail, topic });
    const completedIds = history.map((h) => h.moduleId);

    const modules = topicDoc.modules.map((m: any) => ({
      ...m.toObject(),
      completed: completedIds.includes(m.id),
    }));

    res.json({ modules });
  } catch (err) {
    res.status(500).json({ message: "Failed to get modules" });
  }
});

router.post("/complete-module", authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic, moduleId } = req.body;
    const userEmail = req.user.email;

    const existing = await LearningHistory.findOne({ userEmail, topic, moduleId });
    if (existing && existing.completed) {
      res.json({ message: "Already completed" });
      return;
    }

    if (existing) {
      existing.completed = true;
      existing.completedAt = new Date();
      await existing.save();
    } else {
      await new LearningHistory({
        userEmail,
        topic,
        moduleId,
        completed: true,
        completedAt: new Date(),
      }).save();
    }

    res.json({ message: "Marked as completed" });
  } catch {
    res.status(500).json({ message: "Failed to mark module as complete" });
  }
});

router.get("/history/:topic", authenticateToken, async (req: any, res: Response) => {
  try {
    const { topic } = req.params;
    const userEmail = req.user.email;

    const history = await LearningHistory.find({ userEmail, topic }).sort({ completedAt: -1 });
    res.json({ history });
  } catch {
    res.status(500).json({ message: "Failed to get history" });
  }
});

router.get("/download/:topic/:moduleId", authenticateToken, async (req: Request, res: Response) => {
  const { topic, moduleId } = req.params;

  let moduleTitle = `Module ${moduleId}`;
  let moduleContent = `Content for module ${moduleId} not found.`;

  try {
    const doc = await LearningModule.findOne({ topic });
    if (doc) {
      const module = doc.modules.find((m: any) => m.id === moduleId);
      if (module) {
        moduleTitle = module.title ?? `Module ${moduleId}`;
        moduleContent = module.content ?? `Content for module ${moduleId} not found.`;
      }
    }

    const pdf = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 60, right: 60 } });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${moduleTitle.replace(/\s/g, "_")}.pdf"`
    );
    pdf.pipe(res);

    pdf.font("Helvetica-Bold").fontSize(24).text(`Learning Topic: ${topic}`, { align: "center" });
    pdf.moveDown();
    pdf.font("Helvetica-Bold").fontSize(18).text(`Module: ${moduleTitle}`, { align: "center" });
    pdf.moveDown(2);

    pdf
      .font("Helvetica")
      .fontSize(12)
      .fillColor("black")
      .text(moduleContent, { align: "justify", lineGap: 6 });
//fixing the pdf bug
    pdf.moveDown(2);
    pdf
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, { align: "right" });

    const range = pdf.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      pdf.switchToPage(i);
      pdf.fontSize(8).text(`Page ${i + 1} of ${range.count}`, 0, pdf.page.height - 40, {
        align: "center",
      });
    }

    pdf.end();
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

export default router;
