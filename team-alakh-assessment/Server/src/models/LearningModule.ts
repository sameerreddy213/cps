// models/LearningModule.ts
import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  content: String,
  duration: String,
  type: String,
  downloadUrl: String,
});

const LearningModuleSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("LearningModule", LearningModuleSchema);
