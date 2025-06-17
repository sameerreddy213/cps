// Developed by Manjistha Bidkar

/**
 * Translates text to English
 * @param text Input text in any language
 * @returns Translated English text
 */
import fetch, { RequestInit } from 'node-fetch';

const TRANSLATE_URL = 'https://translate.argosopentech.com/translate';


// Safely translates text with retries and timeout
async function safeFetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  timeoutMs = 10000
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) throw error;
      console.warn(`Attempt ${attempt} failed: ${error}. Retrying...`);
    }
  }
  throw new Error("All retry attempts failed");
}

// Translate a full block of text
export async function translateText(text: string, source: string, target: string): Promise<string> {
  const data = {
    q: text,
    source,
    target,
    format: 'text'
  };

  const json = await safeFetchWithRetry(TRANSLATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return json.translatedText;
}

/**
 * Break large text into chunks to avoid request size issues
 */
// export async function translateTextInChunks(text: string, chunkSize = 4000): Promise<string> {
//   const chunks: string[] = [];
//   for (let i = 0; i < text.length; i += chunkSize) {
//     chunks.push(text.slice(i, i + chunkSize));
//   }

//   const translatedChunks: string[] = [];

//   for (const chunk of chunks) {
//     try {
//       const translated = await translateText(chunk, 'auto', 'en');
//       translatedChunks.push(translated);
//     } catch (err) {
//       console.error('Error translating chunk:', err);
//     }
//   }

//   return translatedChunks.join(' ');
// }

export async function translateTextInChunks(
  text: string,
  source: string = 'auto',
  target: string = 'en',
  chunkSize = 4000
): Promise<string> {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    try {
      const translated = await translateText(chunk, source, target);
      console.log('Translating chunk:', chunk);
      console.log('Result:', translated);
      translatedChunks.push(translated);
    } catch (err) {
      console.error('Error translating chunk:', err);
    }
  }

  return translatedChunks.join(' ');
}
