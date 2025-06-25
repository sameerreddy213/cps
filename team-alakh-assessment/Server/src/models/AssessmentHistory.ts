import mongoose from 'mongoose';

const assessmentHistorySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true }
  }],
  userAnswers: [{ type: Number }],
  score: { type: Number },
  passed: { type: Boolean },
  createdAt: { type: Date, default: Date.now }
});

assessmentHistorySchema.index({ userEmail: 1, topic: 1, createdAt: -1 });

export default mongoose.model('AssessmentHistory', assessmentHistorySchema); 