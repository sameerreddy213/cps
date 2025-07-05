import express from "express";
import QuestionReport from "../models/QuestionReport";

const router = express.Router();

router.post("/", async (req, res) => {
  const { topic, questionIndex, questionText, reportedBy, reason } = req.body;

  const report = await QuestionReport.create({
    topic,
    questionIndex,
    questionText,
    reportedBy,
    reason,
  });

  res.status(201).json({ message: "Report submitted", report });
});

export default router;
