import { Router } from "express";
import PlaySession  from "../models/PlaySession";
import { getAllPrerequisites } from "../utils/conceptGraph";
import { getBinaryQuestionForTopic } from "../utils/extractContent";
const router = Router();

// GET /start?concept=Binary Search&userId=123
router.get("/start", async (req, res) => {
  const { concept, userId } = req.query as { concept: string; userId: string };

  const prerequisites = getAllPrerequisites(concept);

  // Generate binary questions for all prerequisites
  const questionQueue: { concept: string; question: string }[] = [];

  for (const pre of prerequisites) {
    const question = await getBinaryQuestionForTopic(pre);
    if (question) {
      questionQueue.push({ concept: pre, question });
    }
  }

  const session = await PlaySession.create({
    userId,
    targetConcept: concept,
    prerequisites,
    questionQueue,
    answeredQuestions: [],
    weakConcepts: [],
    currentIndex: 0,
  });

  await session.save();

  const firstQuestion = questionQueue[0];

  res.json({
    sessionId: session._id,
    question: firstQuestion,
    isComplete: false,
  });
});


router.post("/answer", async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      res.status(400).json({ error: "Missing sessionId or answer" });
      return;
    }

    const session = await PlaySession.findById(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const index = session.currentIndex;
    if (index >= session.questionQueue.length) {
      res.status(400).json({ error: "Session already completed" });
      return;
    }

    const { concept, question } = session.questionQueue[index];

    // Save the answer
    session.answeredQuestions.push({ concept, question, answer });

    // Track weak concepts
    if (
      typeof answer === "string" &&
      answer.toLowerCase() === "no" &&
      typeof concept === "string" &&
      !session.weakConcepts.includes(concept)
    ) {
      session.weakConcepts.push(concept);
    }

    session.currentIndex += 1;
    await session.save();

    if (session.currentIndex >= session.questionQueue.length) {
      res.json({
        isComplete: true,
        results: {
          strongConcepts: session.prerequisites.filter((c) => !session.weakConcepts.includes(c)),
          weakConcepts: session.weakConcepts,
          recommendedConcepts: session.weakConcepts,
        },
      });
      return;
    }

    const nextQuestion = session.questionQueue[session.currentIndex];

    res.json({
      isComplete: false,
      question: nextQuestion,
    });
    return;
  } catch (error) {
    console.error("❌ Error in /api/answer:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

router.get("/user/:id/playground-attempts", async (req, res) => {
  const { id } = req.params;

  const sessions = await PlaySession.find({ userId: id });
  const history: Record<string, any> = {};

  for (const s of sessions) {
    if (typeof s.targetConcept === "string" && s.targetConcept) {
      history[s.targetConcept] = {
        strongConcepts: s.prerequisites.filter((c) => !s.weakConcepts.includes(c)),
        weakConcepts: s.weakConcepts,
        recommendedConcepts: s.weakConcepts,
      };
    }
  }

  res.json(history);
});

 export default router;