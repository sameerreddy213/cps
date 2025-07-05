import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema],
  },
  { _id: true }
);

const discussionThreadSchema = new mongoose.Schema(
  {
    topic: { type: String },
    questionIndex: { type: Number },
    questionText: { type: String },
    isGeneral: { type: Boolean, default: false },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Optional: add a compound index for question-based threads
discussionThreadSchema.index({ topic: 1, questionIndex: 1 }, { unique: true, sparse: true });

export default mongoose.model("Discussion", discussionThreadSchema);
