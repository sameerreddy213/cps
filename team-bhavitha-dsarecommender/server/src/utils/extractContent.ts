// utils/questionGenerator.ts
import { getTextFromPdfStream } from "./pdfExtractor";
import { buildBinaryQuestionPrompt } from "./buildGeminiPrompt";
import { generateBinaryQuestionWithGemini } from "./geminiClient";
import mongoose from "mongoose";

export async function getBinaryQuestionForTopic(topic: string): Promise<string | null> {
  const db = mongoose.connection.db;
    if (!db) {
        console.error("Database connection not established");
        return null;
    }
  const mapping = await db.collection("topic_mappings").findOne({ topic });

  if (!mapping) return null;

  const file = await db.collection("pdfs.files").findOne({ filename: mapping.pdf });
  if (!file) return null;

  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });
  const stream = bucket.openDownloadStream(file._id);
  const text = await getTextFromPdfStream(stream);
  if (!text) return null;

  const prompt = buildBinaryQuestionPrompt(topic, text);
  const question = await generateBinaryQuestionWithGemini(prompt);

  return question;
}
