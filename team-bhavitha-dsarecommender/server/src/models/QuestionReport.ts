import mongoose from "mongoose";

const QuestionReportSchema = new mongoose.Schema({
  topic: String,
  questionIndex: Number,
  questionText: String,
  reportedBy: String,
  reason: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QuestionReport", QuestionReportSchema);
