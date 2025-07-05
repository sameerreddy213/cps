import express from "express";
import AskedQuestion from "../models/AskedQuestion";

const router = express.Router();

// User asks a question
router.post("/", async (req, res) => {
  const { topic, questionIndex, questionText, askedBy } = req.body;

  const entry = await AskedQuestion.create({
    topic,
    questionIndex,
    questionText,
    askedBy,
  });

  res.status(201).json(entry);
});

// Educator answers
router.post("/answer/:id", async (req, res) => {
  const { response } = req.body;
  const question = await AskedQuestion.findByIdAndUpdate(
    req.params.id,
    { response, isAnswered: true },
    { new: true }
  );

  res.status(200).json(question);
});

export default router;
