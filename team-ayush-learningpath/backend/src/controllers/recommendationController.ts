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

// // --basic version--

// import { Request, Response } from "express";
// import UserConceptProgress from "../models/userConceptProgress";
// import Concept from "../models/conceptModel";
// import { buildConceptGraph, getFullLearningPath } from "../utils/graphUtils"; // <- Make sure this is imported
// import { alg } from "graphlib";
// import { getUserProgressMap } from "../utils/progressUtils";  // <-- newly added
// import { canUserAttempt } from '../utils/recommendUtils';// <-- newly added


// // --- basic version ---
// // export const getRecommendation = async (req: Request, res: Response) => {
// //   try {
// //     const { userId, goalConceptId } = req.params;
// //     const currentConceptId = req.query.currentConceptId as string;

// //     if (!userId || !goalConceptId || !currentConceptId) {
// //       return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
// //     }

// //     // Load all concepts
// //     const concepts = await Concept.find({}, {_id:1, title:1, prerequisites:1});

// //     // for (const concept of concepts) {
// //     //   console.log(
// //     //   concept.id.toString(),
// //     //   Array.isArray(concept.prerequisites) ? concept.prerequisites.map(p => p.toString()) : 'No prerequisites'
// //     //   );
// //     // }


// //     // for (const concept of concepts) {
// //     //   console.log(concept._id, concept.prerequisites);
// //     // }


// //     // Map Mongoose documents to ConceptNode objects with string _id and prerequisites
// //     const conceptNodes = concepts.map((c: any) => ({
// //       _id: c._id.toString(),
// //       prerequisites: Array.isArray(c.prerequisites || c.prerequisites)
// //         ? (c.prerequisites || c.prerequisites).map((p: any) => p.toString())
// //         : [],
// //     }));

// //     // Build the concept graph
// //     const graph = buildConceptGraph(conceptNodes);

// //     if (!alg.isAcyclic(graph)) {
// //       const cycles = alg.findCycles(graph);
// //       console.log("⚠️ Cycles detected:", cycles);
// //     } else {
// //     console.log("✅ Graph is acyclic.");
// //     }

// //     // 🔍 Optional Debug Logs
// //     // console.log("🔧 Graph Nodes:", graph.nodes());
// //     // console.log("🔧 Graph Edges:", graph.edges());
// //     // console.log("📍 From:", currentConceptId, "To:", goalConceptId);

// //     // Compute full learning path (do not skip anything)
// //     const path = getFullLearningPath(graph, currentConceptId.toString(), goalConceptId.toString());

// //     if (path.length > 0) {
// //       const detailedPath = await Concept.find({ _id: { $in: path } }).select("_id title");
// //       console.log("Path found:", path);

// //       return res.json({ recommendedPath: path, detailedPath });
// //     }

// //     res.status(404).json({ message: "No valid path found to target concept." });
// //   } catch (error: any) {
// //     console.error("Error in recommendation:", error);
// //     res.status(500).json({ error: "Internal server error", details: error.message });
// //   }
// // };

// import { Request, Response } from "express";
// import UserConceptProgress from "../models/userConceptProgress";
// import Concept from "../models/conceptModel";
// import { buildConceptGraph, getFullLearningPath } from "../utils/graphUtils";
// import { getUserProgressMap } from "../utils/progressUtils";
// import { canUserAttempt } from "../utils/recommendUtils";
// import { alg } from "graphlib";

// export const getRecommendation = async (req: Request, res: Response) => {
//   try {
//     const { userId, goalConceptId } = req.params;
//     const currentConceptId = req.query.currentConceptId as string;

//     if (!userId || !goalConceptId || !currentConceptId) {
//       return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
//     }

//     // 1. Load all concepts with minimum required fields
//     const concepts = await Concept.find({}, { _id: 1, title: 1, prerequisites: 1 });

//     // 2. Convert concepts into graph nodes
//     const conceptNodes = concepts.map((c: any) => ({
//       _id: c._id.toString(),
//       prerequisites: Array.isArray(c.prerequisites)
//         ? c.prerequisites.map((p: any) => p.toString())
//         : [],
//     }));

//     // 3. Build the prerequisite graph
//     const graph = buildConceptGraph(conceptNodes);

//     // 4. Optional: check for cycles
//     if (!alg.isAcyclic(graph)) {
//       const cycles = alg.findCycles(graph);
//       console.warn("⚠️ Cycles detected in concept graph:", cycles);
//       return res.status(500).json({ error: "Cycle detected in concept prerequisites.", cycles });
//     }

//     // 5. Find full path from current to goal concept
//     const path = getFullLearningPath(graph, currentConceptId, goalConceptId);

//     if (path.length === 0) {
//       return res.status(404).json({ message: "No valid path found to target concept." });
//     }

//     // 6. Get user's mastery scores
//     const userProgressMap = await getUserProgressMap(userId);

//     // 7. Filter path using mastery layer
//     const personalizedPath = path.filter(conceptId => {
//       const mastered = userProgressMap[conceptId]?.masteryScore ?? 0;
//       return canUserAttempt(conceptId, userProgressMap, graph) && mastered < 100;
//     });

//     if (personalizedPath.length === 0) {
//       return res.status(200).json({ message: "No new concepts available for recommendation. All mastered or blocked by prerequisites." });
//     }

//     // 8. Get detailed concept info for display
//     const detailedPath = await Concept.find({ _id: { $in: personalizedPath } }).select("_id title");

//     return res.json({
//       fullPath: path,
//       recommendedPath: personalizedPath,
//       detailedPath
//     });

//   } catch (error: any) {
//     console.error("🚨 Error in personalized recommendation:", error);
//     return res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };

// --working mastery--
// import { Request, Response } from "express";
// import UserConceptProgress from "../models/userConceptProgress";
// import Concept from "../models/conceptModel";
// import { buildConceptGraph, getFullLearningPath } from "../utils/graphUtils";
// import { alg } from "graphlib";

// export const getRecommendation = async (req: Request, res: Response) => {
//   try {
//     const { userId, goalConceptId } = req.params;
//     const currentConceptId = req.query.currentConceptId as string;

//     if (!userId || !goalConceptId || !currentConceptId) {
//       return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
//     }

//     // Load all concepts (with prerequisites and title)
//     const concepts = await Concept.find({}, { _id: 1, title: 1, prerequisites: 1 });

//     // Format for graphlib
//     const conceptNodes = concepts.map(c => ({
//       _id: c.id.toString(),
//       prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(p => p.toString()) : [],
//     }));

//     // Build graph
//     const graph = buildConceptGraph(conceptNodes);

//     if (!alg.isAcyclic(graph)) {
//       const cycles = alg.findCycles(graph);
//       console.warn("⚠️ Graph contains cycles:", cycles);
//       return res.status(500).json({ error: "Concept graph contains cycles." });
//     }

//     // Find full path (prerequisite-safe)
//     const path = getFullLearningPath(graph, currentConceptId.toString(), goalConceptId.toString());

//     if (path.length === 0) {
//       return res.status(404).json({ message: "No valid path found to target concept." });
//     }

//     // Get user's mastery scores
//     const progress = await UserConceptProgress.find({ userId });
//     const masteryMap: Record<string, number> = {};
//     progress.forEach(doc => {
//       masteryMap[doc.conceptId.toString()] = doc.score;
//     });

//     // Prepare concept map for quick title lookup
//     const conceptMap: Record<string, { title: string; prerequisites: string[] }> = {};
//     concepts.forEach(c => {
//       conceptMap[c.id.toString()] = {
//         title: c.title,
//         prerequisites: Array.isArray(c.prerequisites)
//           ? c.prerequisites.map(p => p.toString())
//           : [],
//       };
//     });

//     // Build detailed path with locking logic
//     const detailedPath = path.map(conceptId => {
//       const prerequisites = conceptMap[conceptId].prerequisites;
//       const locked = prerequisites.some(prereqId => (masteryMap[prereqId] ?? 0) < 0.7);

//       return {
//         conceptId,
//         title: conceptMap[conceptId].title,
//         locked,
//       };
//     });

//     return res.json({ recommendedPath: path, detailedPath });

//   } catch (error: any) {
//     console.error("Error in recommendation:", error);
//     res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };

// # 
// * show the mastery score of the user for any prerequisite required in the path 
// so as to show why one concept is locked or unlocked

// import { Request, Response } from "express";
// import UserConceptProgress from "../models/userConceptProgress";
// import Concept from "../models/conceptModel";
// import { buildConceptGraph, getFullLearningPath } from "../utils/graphUtils";
// import { alg } from "graphlib";

// export const getRecommendation = async (req: Request, res: Response) => {
//   try {
//     const { userId, goalConceptId } = req.params;
//     const currentConceptId = req.query.currentConceptId as string;

//     if (!userId || !goalConceptId || !currentConceptId) {
//       return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
//     }

//     // Load all concepts
//     const concepts = await Concept.find({}, { _id: 1, title: 1, prerequisites: 1 });

//     // Format for graphlib
//     const conceptNodes = concepts.map(c => ({
//       _id: c.id.toString(),
//       prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(p => p.toString()) : [],
//     }));

//     // Build concept graph
//     const graph = buildConceptGraph(conceptNodes);

//     if (!alg.isAcyclic(graph)) {
//       const cycles = alg.findCycles(graph);
//       console.warn("⚠️ Graph contains cycles:", cycles);
//       return res.status(500).json({ error: "Concept graph contains cycles." });
//     }

//     // Get the full learning path
//     const path = getFullLearningPath(graph, currentConceptId.toString(), goalConceptId.toString());

//     if (path.length === 0) {
//       return res.status(404).json({ message: "No valid path found to target concept." });
//     }

//     // Fetch user's mastery data
//     const progress = await UserConceptProgress.find({ userId });
//     const masteryMap: Record<string, number> = {};
//     progress.forEach(doc => {
//       masteryMap[doc.conceptId.toString()] = doc.score;
//     });

//     // Prepare concept map for easy lookup
//     const conceptMap: Record<string, { title: string; prerequisites: string[] }> = {};
//     concepts.forEach(c => {
//       conceptMap[c.id.toString()] = {
//         title: c.title,
//         prerequisites: Array.isArray(c.prerequisites)
//           ? c.prerequisites.map(p => p.toString())
//           : [],
//       };
//     });

//     // Build detailed path with locking and mastery explanation
//     const detailedPath = path.map(conceptId => {
//       const prerequisites = conceptMap[conceptId].prerequisites;

//       const prerequisiteMasteries = prerequisites.map(prereqId => ({
//         prerequisiteId: prereqId,
//         score: masteryMap[prereqId] ?? 0,
//       }));

//       const locked = prerequisiteMasteries.some(p => p.score < 0.7);

//       return {
//         conceptId,
//         title: conceptMap[conceptId].title,
//         locked,
//         prerequisiteMasteries,
//       };
//     });

//     return res.status(200).json({ recommendedPath: path, detailedPath });

//   } catch (error: any) {
//     console.error("Error in recommendation:", error);
//     return res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };


// **It locks the unmastered concepts and displays all possible paths to reach the target and 
// user's mastery score for the prerequisites

// import { Request, Response } from "express";
// import UserConceptProgress from "../models/userConceptProgress";
// import Concept from "../models/conceptModel";
// import { buildConceptGraph, getAllPaths } from "../utils/graphUtils"; // you need this util
// import { alg } from "graphlib";

// export const getRecommendation = async (req: Request, res: Response) => {
//   try {
//     const { userId, goalConceptId } = req.params;
//     const currentConceptId = req.query.currentConceptId as string;

//     if (!userId || !goalConceptId || !currentConceptId) {
//       return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
//     }

//     // Load concepts
//     const concepts = await Concept.find({}, { _id: 1, title: 1, prerequisites: 1 });

//     const conceptNodes = concepts.map(c => ({
//       _id: c.id.toString(),
//       prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(p => p.toString()) : [],
//     }));

//     const graph = buildConceptGraph(conceptNodes);

//     // if (!alg.isAcyclic(graph)) {
//     //   const cycles = alg.findCycles(graph);
//     //   console.warn("Graph has cycles:", cycles);
//     //   return res.status(500).json({ error: "Concept graph contains cycles." });
//     // }

//     // Get all paths from current → target
//     const allPaths = getAllPaths(graph, currentConceptId.toString(), goalConceptId.toString());

//     if (!allPaths.length) {
//       return res.status(404).json({ message: "No valid paths found from current to target concept." });
//     }

//     // User's mastery map
//     const progress = await UserConceptProgress.find({ userId });
//     const masteryMap: Record<string, number> = {};
//     progress.forEach(doc => {
//       masteryMap[doc.conceptId.toString()] = doc.score;
//     });

//     // Concept details map
//     const conceptMap: Record<string, { title: string; prerequisites: string[] }> = {};
//     concepts.forEach(c => {
//       conceptMap[c.id.toString()] = {
//         title: c.title,
//         prerequisites: Array.isArray(c.prerequisites)
//           ? c.prerequisites.map(p => p.toString())
//           : [],
//       };
//     });

//     const allDetailedPaths = allPaths.map(path => {
//       const detailedPath = path.map(conceptId => {
//         const prerequisites = conceptMap[conceptId]?.prerequisites || [];
//         const prerequisiteMasteries = prerequisites.map(prereqId => ({
//           prerequisiteId: prereqId,
//           score: masteryMap[prereqId] ?? 0
//         }));
//         const locked = prerequisiteMasteries.some(p => p.score < 0.7);

//         return {
//           conceptId,
//           title: conceptMap[conceptId]?.title || "Unknown",
//           locked,
//           prerequisiteMasteries
//         };
//       });

//       return {
//         path,
//         detailedPath
//       };
//     });

//     return res.status(200).json({ allPaths: allDetailedPaths });

//   } catch (error: any) {
//     console.error("Error in recommendation:", error);
//     return res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };

import { Request, Response } from "express";
import UserConceptProgress from "../models/userConceptProgress";
import Concept from "../models/conceptModel";
import { buildConceptGraph, getAllPaths } from "../utils/graphUtils";
import { alg } from "graphlib";

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { userId, goalConceptId } = req.params;
    const currentConceptId = req.query.currentConceptId as string;

    if (!userId || !goalConceptId || !currentConceptId) {
      return res.status(400).json({ error: "Missing userId, goalConceptId, or currentConceptId" });
    }

    // Load all concepts
    const concepts = await Concept.find({}, { _id: 1, title: 1, prerequisites: 1 });

    // Format for graphlib
    const conceptNodes = concepts.map(c => ({
      _id: c.id.toString(),
      prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(p => p.toString()) : [],
    }));

    const graph = buildConceptGraph(conceptNodes);

    // Get all paths
    const allPathsRaw = getAllPaths(graph, currentConceptId.toString(), goalConceptId.toString());
    if (allPathsRaw.length === 0) {
      return res.status(404).json({ message: "No paths found to target concept." });
    }

    // Get user mastery scores
    const userProgress = await UserConceptProgress.find({ userId });
    const masteryMap: Record<string, number> = {};
    userProgress.forEach(p => {
      masteryMap[p.conceptId.toString()] = p.score;
    });

    // Build concept lookup
    const conceptMap: Record<string, { title: string; prerequisites: string[] }> = {};
    concepts.forEach(c => {
      conceptMap[c.id.toString()] = {
        title: c.title,
        prerequisites: (c.prerequisites || []).map(p => p.toString())
      };
    });

    // Prepare paths with lock & score info
    const allPaths = allPathsRaw.map(path => {
      let totalCost = 0;
      const detailedPath = path.map(conceptId => {
        const prereqs = conceptMap[conceptId]?.prerequisites || [];

        const prerequisiteMasteries = prereqs.map(prereqId => ({
          prerequisiteId: prereqId,
          score: masteryMap[prereqId] ?? 0
        }));

        const locked = prerequisiteMasteries.some(p => p.score < 0.7);

        const mastery = masteryMap[conceptId] ?? 0;
        const cost = (mastery < 0.7) ? 1 - mastery : 0;
        totalCost += cost;

        return {
          conceptId,
          title: conceptMap[conceptId]?.title || "Unknown",
          locked,
          prerequisiteMasteries
        };
      });

      return { path, detailedPath, totalCost };
    });

    // Select best path (lowest cost)
    const bestPath = [...allPaths].sort((a, b) => a.totalCost - b.totalCost)[0];

    return res.status(200).json({
      bestPath,
      allPaths
    });

  } catch (error: any) {
    console.error("Error generating recommendation:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
