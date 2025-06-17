// Developed by Manjistha Bidkar
import { execa } from 'execa';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Downloads subtitles for the given YouTube video ID and returns the VTT file path.
 * Tries English first, then falls back to best available.
 */
export async function downloadSubtitles(videoId: string, outputDir: string): Promise<string> {
  const baseUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const output = path.join(outputDir, `${videoId}.%(ext)s`);

  // Try English first
  try {
    await execa('yt-dlp', [
      '--write-auto-sub',
      '--write-sub',
      '--sub-lang', 'en',
      '--skip-download',
      '-o', output,
      baseUrl,
    ]);

    const enVtt = fs.readdirSync(outputDir).find(f => f.startsWith(videoId) && f.endsWith('.en.vtt'));
    if (enVtt) return path.join(outputDir, enVtt);
  } catch {
    // Continue to fallback
  }

  // Fallback: try any best available subtitle
  try {
    await execa('yt-dlp', [
      '--write-auto-sub',
      '--write-sub',
      '--sub-lang', 'best',
      '--skip-download',
      '-o', output,
      baseUrl,
    ]);

    const fallback = fs.readdirSync(outputDir).find(f => f.startsWith(videoId) && f.endsWith('.vtt'));
    if (fallback) return path.join(outputDir, fallback);
  } catch (error) {
  if (error instanceof Error) {
    console.error(`Failed to download subtitles for ${videoId}. yt-dlp error:`, error.message);
  } else {
    console.error(`Failed to download subtitles for ${videoId}. Unknown error:`, error);
  }
}
  throw new Error(`No subtitle found for video: ${videoId}`);
}
