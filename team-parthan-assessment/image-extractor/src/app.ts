// Developed by Manjistha Bidkar
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { preprocessImage } from "./utils/preprocess";
import { extractTextFromImage } from "./utils/ocr";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const rawPath = path.join(__dirname, "..", req.file.path);
  const processedPath = rawPath + "_processed.png";

  try {
    await preprocessImage(rawPath, processedPath);
    const text = await extractTextFromImage(processedPath);
    res.json({ extracted_text: text });
  } catch (error) {
    console.error("OCR failed:", error);
    res.status(500).json({ error: "OCR failed" });
  } finally {
    fs.unlink(rawPath, () => {});
    fs.unlink(processedPath, () => {});
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
