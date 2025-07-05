import mongoose from "mongoose";

const AskedQuestionSchema = new mongoose.Schema({
  topic: String,
  questionIndex: Number,
  questionText: String,
  askedBy: String,
  response: String,
  isAnswered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AskedQuestion", AskedQuestionSchema);
