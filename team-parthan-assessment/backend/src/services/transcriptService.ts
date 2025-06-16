// Developed by Manjistha Bidkar
import { downloadSubtitles } from './downloader';
import { parseVtt } from './parser';

export async function processTranscript(videoId: string) {
  await downloadSubtitles(videoId);
  return await parseVtt(videoId);
  return "dfs"
}
