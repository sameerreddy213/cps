
// Developed by Manjistha Bidkar
// Main entry point: Extracts transcript from YouTube video and matches topics from an Excel concept graph

import { loadConceptsFromExcel, identifyConcepts } from './utils/matchTopics';
import { processTranscript } from './services/transcriptService';

/**
 * Extracts the YouTube video ID from the full video URL
 * @param url YouTube video URL
 * @returns Extracted video ID or null
 */
function extractVideoId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Main function to run topic matching from YouTube transcript
 * @param url Full YouTube video URL
 */
async function runYoutubeTranscriptMatching(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.error('Invalid YouTube URL.');
    return;
  }

  console.log('Extracting transcript for: ${videoId}');
  const transcriptText = await processTranscript(videoId);

  if (!transcriptText.trim()) {
    console.warn('Transcript could not be extracted or is empty.');
    return;
  }

  const conceptList = loadConceptsFromExcel('DSA_Concept_Graph.xlsx');
  const matchedConcepts = identifyConcepts(transcriptText, conceptList);

  if (matchedConcepts.length === 0) {
    console.log('\n No topics matched from the existing data dependency graph.');
  } else {
    console.log('\n Topics matched from YouTube transcript:');
    console.log(matchedConcepts);
  }
}

// CLI execution: Read URL from command line
const url = process.argv[2];
runYoutubeTranscriptMatching(url);
