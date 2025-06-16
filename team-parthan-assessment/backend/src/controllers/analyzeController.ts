<<<<<<< HEAD:team-parthan-assessment/backend/src/controllers/analyzeController.ts
import getMainTopic from '../services/getMainTopic';
import getAllPrerequisites from '../services/getPrerequisite';
=======
// import getMainTopic from '../services/getMainTopic.js';
// import getAllPrerequisites from '../services/getPrerequisite.js';
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/controllers/analyzeController.ts
import {Request,Response} from 'express';
const analyzeController = async (req:Request, res:Response) => {
  try {
    const { typeofinput } = req.body;
<<<<<<< HEAD:team-parthan-assessment/backend/src/controllers/analyzeController.ts
    console.log(`type is ${typeofinput}`);
    let inputData = '';

    const file = req.file;

  //   if (!file || !typeofinput) {
  //   return res.status(400).json({ error: 'Missing file or input type' });
  // }

    if (typeofinput === 'youtube') {
=======
    let inputData = '';

    if (typeofinput === 'link') {
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/controllers/analyzeController.ts
      inputData = req.body.input;
    } else if (typeofinput === 'pdf' || typeofinput === 'image') {
      if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
      }
      inputData = req.file.path;
<<<<<<< HEAD:team-parthan-assessment/backend/src/controllers/analyzeController.ts
      console.log(`inputdata${inputData}`);
=======
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/controllers/analyzeController.ts
    } else {
      return res.status(400).json({ error: 'Invalid input type' });
    }

<<<<<<< HEAD:team-parthan-assessment/backend/src/controllers/analyzeController.ts
    const mainTopic = await getMainTopic(inputData, typeofinput);
    console.log(mainTopic);
    let mainTopicsArray: string[];

    if (typeof mainTopic === 'string') {
      mainTopicsArray = [mainTopic];
    } else if (Array.isArray(mainTopic)) {
      mainTopicsArray = mainTopic;
    } else {
      return res.status(400).json({ error: 'Invalid main topic returned' });
    }

    const prerequisites = await getAllPrerequisites(mainTopicsArray);

    return res.json({ mainTopic, prerequisites });
  } catch (error) {
    //console.log(req.body);
=======
    // const mainTopic = await getMainTopic(inputData, typeofinput);
    // const prerequisites = await getAllPrerequisites(mainTopic);

    // return res.json({ mainTopic, prerequisites });
  } catch (error) {
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/controllers/analyzeController.ts
    console.error('Error analyzing input:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};                                        

export default analyzeController;