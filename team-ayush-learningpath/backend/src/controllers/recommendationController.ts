// import { Request, Response } from 'express';
// import axios from 'axios';
// import User from '../models/userModel';
// import Concept from '../models/conceptModel';

// /**
//  * @desc    Generates a personalized learning path by calling the Flask AI service.
//  * @route   POST /api/recommendations/generate
//  * @access  Private
//  */
// export const generateRecommendation = async (req: Request, res: Response) => {
//     try {
//         const { targetConceptId } = req.body;
//         if (!targetConceptId) {
//             return res.status(400).json({ message: 'A target concept ID is required.' });
//         }

//         // --- Step 1: Gather data from MongoDB ---
//         const user = await User.findById(req.user?.id).select('learningProfile');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const allConcepts = await Concept.find({}).select('_id prerequisites');
//         if (!allConcepts || allConcepts.length === 0) {
//             return res.status(404).json({ message: 'No learning concepts found.' });
//         }

//         // --- Step 2: Prepare payload for Flask API ---
//         const payload = {
//             userId: user._id,
//             learningProfile: user.learningProfile,
//             targetConceptId: targetConceptId,
//             knowledgeGraph: allConcepts,
//         };

//         // --- Step 3: Call Flask API (using a placeholder for now) ---
//         const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:5001/recommend';
        
//         // Uncomment the following lines to make a real API call
//         // const { data } = await axios.post(flaskApiUrl, payload);
//         // return res.status(200).json(data);
        
//         // Mock response for testing without a live Flask server
//         res.status(200).json({
//             message: 'This is a mock response. The recommendation engine would be called here.',
//             recommendedPath: [
//                 { conceptId: 'mock_id_1', title: 'Example Prerequisite' },
//                 { conceptId: targetConceptId, title: 'Your Target Concept' },
//             ],
//             sentPayload: payload, // Echo back the payload for debugging
//         });

//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Flask API Error:', error.message);
//             return res.status(502).json({ message: 'Recommendation service is unavailable.' });
//         }
//         console.error('Server Error:', error);
//         res.status(500).json({ message: 'An internal server error occurred.' });
//     }
// };

import { Request, Response } from "express";
import UserConceptProgress from "../models/userConceptProgress";
import Concept from "../models/conceptModel";
import { buildConceptGraph, getFullLearningPath } from "../utils/graphUtils"; // <- Make sure this is imported
import { alg } from "graphlib";

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { userId, goalConceptId } = req.params;
    const currentConceptId = req.query.currentConceptId as string;

    if (!userId || !goalConceptId || !currentConceptId) {
      return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
    }

    // Load all concepts
    const concepts = await Concept.find({}, {_id:1, title:1, prerequisites:1});

    // for (const concept of concepts) {
    //   console.log(
    //   concept.id.toString(),
    //   Array.isArray(concept.prerequisites) ? concept.prerequisites.map(p => p.toString()) : 'No prerequisites'
    //   );
    // }


    // for (const concept of concepts) {
    //   console.log(concept._id, concept.prerequisites);
    // }


    // Map Mongoose documents to ConceptNode objects with string _id and prerequisites
    const conceptNodes = concepts.map((c: any) => ({
      _id: c._id.toString(),
      prerequisites: Array.isArray(c.prerequisites || c.prerequisites)
        ? (c.prerequisites || c.prerequisites).map((p: any) => p.toString())
        : [],
    }));

    // Build the concept graph
    const graph = buildConceptGraph(conceptNodes);

    if (!alg.isAcyclic(graph)) {
      const cycles = alg.findCycles(graph);
      console.log("⚠️ Cycles detected:", cycles);
    } else {
    console.log("✅ Graph is acyclic.");
    }

    // 🔍 Optional Debug Logs
    // console.log("🔧 Graph Nodes:", graph.nodes());
    // console.log("🔧 Graph Edges:", graph.edges());
    // console.log("📍 From:", currentConceptId, "To:", goalConceptId);

    // Compute full learning path (do not skip anything)
    const path = getFullLearningPath(graph, currentConceptId.toString(), goalConceptId.toString());

    if (path.length > 0) {
      const detailedPath = await Concept.find({ _id: { $in: path } }).select("_id title");
      console.log("Path found:", path);

      return res.json({ recommendedPath: path, detailedPath });
    }

    res.status(404).json({ message: "No valid path found to target concept." });
  } catch (error: any) {
    console.error("Error in recommendation:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
