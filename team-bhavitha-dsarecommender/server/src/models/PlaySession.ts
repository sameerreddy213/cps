// models/PlaySession.ts
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: String,
  targetConcept: String,
  prerequisites: [String],
  weakConcepts: [String],
  answeredQuestions: [
    {
      concept: String,
      question: String,
      answer: String,
    },
  ],
  questionQueue: [
    {
      concept: String,
      question: String,
    },
  ],
  currentIndex: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("PlaySession", sessionSchema);
