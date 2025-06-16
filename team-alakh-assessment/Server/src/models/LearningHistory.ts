import mongoose from 'mongoose';

const learningHistorySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  topic: { type: String, required: true },
  moduleId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index for efficient queries
learningHistorySchema.index({ userEmail: 1, topic: 1, moduleId: 1 }, { unique: true });

export default mongoose.model('LearningHistory', learningHistorySchema);