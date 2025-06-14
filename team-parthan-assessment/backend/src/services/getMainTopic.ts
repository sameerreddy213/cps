import { dsaConcepts } from "../../../concept-graph/conceptList";
import {extractTextFromPDF} from "../../../pdf-parser/src/utils/pdfExtractor"
import {identifyConcepts} from "../../../pdf-parser/src/utils/matchTopics"

export default async function getMainTopic(
  inputData: string,typeOfInput: string 
) {
  if (typeOfInput == 'link') {
    // Call transcript + topic extractor logic
    return 'Dynamic Programming'; // placeholder
  }
  if (typeOfInput === 'pdf' || typeOfInput === 'image') {
    //console.log("pdf");
    const text = await extractTextFromPDF(inputData);

    let conceptsList = [];

    for (let concept of dsaConcepts) {
      
      conceptsList.push(concept.toLowerCase());

    }
    

    //console.log(text);
    const matchedConcepts = identifyConcepts(text, conceptsList);
    //console.log(dsaConcepts)
    //console.log(matchedConcepts);
    // Extract text then topic from file
    return matchedConcepts; // placeholder
  }
};
