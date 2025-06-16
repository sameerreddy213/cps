import { dsaConcepts } from "../concept-graph/conceptList";
import {extractTextFromPDF} from "./pdfExtractor"
import {identifyConcepts} from "./matchTopics"
import {processTranscript} from "./transcriptService"


function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    } else if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    } else {
      return null;
    }
  } catch {
    return null;
  }
}



export default async function getMainTopic(
  inputData: string,typeOfInput: string 
) 

{

  let conceptsList = [];

    for (let concept of dsaConcepts) {
      
      conceptsList.push(concept.toLowerCase());

    }
  if (typeOfInput == 'youtube') {
    // Call transcript + topic extractor logic
    const videoId = extractVideoId(inputData);
    if (!videoId) {
      console.warn(`⚠️ Could not extract video ID from: ${inputData}`);
      
    }

    try {
      console.log(`📡 Processing: ${videoId}`);
      if(videoId)
      {

      const transcript = await processTranscript(videoId);
      console.log(`\n✅ Transcript :\n${transcript}\n`);
      const matchedConcepts = identifyConcepts(transcript, conceptsList);
      return matchedConcepts;
      }
    } catch (e) {
      console.error(`❌ Error for ${videoId}:`, e);
    }
  }
    
  
  if (typeOfInput === 'pdf' || typeOfInput === 'image') {
    //console.log("pdf");
    const text = await extractTextFromPDF(inputData);

    
    

    //console.log(text);
    const matchedConcepts = identifyConcepts(text, conceptsList);
    //console.log(dsaConcepts)
    //console.log(matchedConcepts);
    // Extract text then topic from file
    return matchedConcepts; // placeholder
  }
}
