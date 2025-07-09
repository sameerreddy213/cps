import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateBinaryQuestionWithGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    return response.text().trim();
  } catch (err) {
    console.error(" Gemini error:", err);
    return "";
  }
}
