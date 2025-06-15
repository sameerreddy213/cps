// Developed by Manjistha Bidkar

import * as fs from 'fs';
import pdf from 'pdf-parse';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text // full text content
  } catch (err) {
    console.error("Error reading PDF:", err);
    return '';
  }
}
