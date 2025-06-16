import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema({
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
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now, expires: 3600 } // Expires after 1 hour
});

// Create compound index for efficient queries
quizSessionSchema.index({ userEmail: 1, topic: 1 });

export default mongoose.model('QuizSession', quizSessionSchema);