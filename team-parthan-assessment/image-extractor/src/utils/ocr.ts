// Developed by Manjistha Bidkar
// use ocr to idenfity content in the image
import { createWorker } from "tesseract.js";

export async function extractTextFromImage(imagePath: string): Promise<string> {
  const worker = await createWorker({
    logger: (m: any) => console.log(m.status, Math.round(m.progress * 100) + "%")
  });

  try {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    await worker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.:-_()[]{} '
    });

    const { data } = await worker.recognize(imagePath);
    return data.text.replace(/[^\x20-\x7E\n]/g, "").trim(); // clean weird chars
  } finally {
    await worker.terminate();
  }
}

