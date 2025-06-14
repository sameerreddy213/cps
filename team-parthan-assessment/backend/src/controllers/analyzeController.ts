import getMainTopic from '../services/getMainTopic';
import getAllPrerequisites from '../services/getPrerequisite';
import { Request, Response } from 'express';
import fs from 'fs';

const analyzeController = async (req: Request, res:Response) => {
  try {
    const { typeofinput } = req.body;
    //console.log(`type is ${typeofinput}`);
    let inputData = '';

    if (typeofinput === 'link') {
      inputData = req.body.input;
    } else if (typeofinput === 'pdf' || typeofinput === 'image') {
      if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
      }
      inputData = req.file.path;
      //console.log(`inputdata${inputData}`);
    } else {
      return res.status(400).json({ error: 'Invalid input type' });
    }

    const mainTopic = await getMainTopic(inputData, typeofinput);
    //console.log(mainTopic)
    if (!mainTopic || !Array.isArray(mainTopic)) {
      return res.status(400).json({ error: 'Could not determine main topic(s)' });
    }
    const prerequisites = await getAllPrerequisites(mainTopic);

    fs.unlinkSync(inputData);

    return res.json({ mainTopic, prerequisites });
  } catch (error) {
    //console.log(req.body);
    console.error('Error analyzing input:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default analyzeController;