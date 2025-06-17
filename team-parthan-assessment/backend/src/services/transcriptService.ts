// Developed by Manjistha Bidkar
// This module orchestrates the subtitle download and parsing for a given YouTube video ID

import { downloadSubtitles } from './downloader';
import { parseVttFile } from './parser';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Downloads subtitles (preferring English) and extracts clean text for concept matching
 * @param videoId YouTube video ID
 * @returns Extracted transcript text
 */
export async function processTranscript(videoId: string): Promise<string> {
  const tempDir = path.resolve('./temp_subtitles');

  // Ensure temp directory exists
  await fs.ensureDir(tempDir);

  try {
    const subtitlePath = await downloadSubtitles(videoId, tempDir);
    const transcriptText = await parseVttFile(subtitlePath);

    // Delete subtitle file after processing
    await fs.remove(subtitlePath);
    //console.log(transcriptText);
    return transcriptText;
  } catch (err) {
    console.error('Error processing transcript for ${videoId}:', err);
    return '';
  } finally {
    // Clean up the temporary folder
    await fs.remove(tempDir);
  }
}

