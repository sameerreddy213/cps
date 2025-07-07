// src/routes/discussionRoutes.ts
import express from "express";
import Discussion from "../models/discussion";

const router = express.Router();

// 1. Get all discussion threads
router.get("/all", async (_, res) => {
  try {
    const threads = await Discussion.find().sort({ updatedAt: -1 });
    res.json({ threads });
  } catch (err) {
    console.error("Failed to fetch discussions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. General discussion thread (updated field names)
router.post("/general", async (req, res) => {
  const { username, text } = req.body;  // Changed to consistent fields
  if (!username || !text) {
    res.status(400).json({ error: "Missing username or comment text" });
    return;
  }

  try {
    const thread = new Discussion({
      isGeneral: true,
      comments: [{ username, text }],
    });
    await thread.save();
    res.status(201).json({ message: "General discussion thread created", thread });
  } catch (err) {
    console.error("Error creating general discussion:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Create or get a thread for a specific question
router.post("/create-or-get", async (req, res) => {
  const { topic, questionIndex, questionText } = req.body;

  if (!topic || questionIndex === undefined || !questionText) {
    res.status(400).json({ error: "Missing topic, questionIndex or questionText" });
    return;
  }

  try {
    let thread = await Discussion.findOne({ topic, questionIndex });
    if (!thread) {
      thread = new Discussion({ topic, questionIndex, questionText });
      await thread.save();
    }
    res.status(200).json(thread);
  } catch (err) {
    console.error("Error in /create-or-get:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. Add comment to question-based thread (updated path and fields)
router.post("/question/:topic/:qIndex", async (req, res) => {
  const { topic, qIndex } = req.params;
  const { username, text } = req.body;  // Changed to consistent fields

  if (!username || !text) {
    res.status(400).json({ error: "Missing username or comment text" });
    return;
  }

  try {
    let thread = await Discussion.findOne({ topic, questionIndex: qIndex });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    
    thread.comments.push({ username, text });
    await thread.save();
    res.status(201).json({ message: "Comment added", thread });
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Comment on a thread using its ID (updated path)
router.post("/thread/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { username, text } = req.body;

  if (!username || !text) {
    res.status(400).json({ error: "Missing username or comment text" });
    return;
  }

  try {
    const thread = await Discussion.findById(id);
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    thread.comments.push({ username, text });
    await thread.save();
    res.status(200).json({ message: "Comment added", thread });
  } catch (err) {
    console.error("Failed to comment on thread:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Get a thread by ID
router.get("/thread/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Discussion.findById(id);
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    res.status(200).json(thread);
  } catch (err) {
    console.error("Error fetching thread by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /discuss/:threadId/comment/:commentId/reply
router.post("/:threadId/comment/:commentId/reply", async (req, res) => {
  const { threadId, commentId } = req.params;
  const { username, text } = req.body;

  if (!username || !text) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const thread = await Discussion.findById(threadId);
    if (!thread){
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    const comment = thread.comments.id(commentId);
    if (!comment){
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    comment.replies.push({ username, text });
    await thread.save();

    res.status(200).json({ message: "Reply added", thread });
  } catch (err) {
    console.error("Error replying to comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// DELETE /discuss/thread/:threadId/comment/:commentId
router.delete("/thread/:threadId/comment/:commentId", async (req, res) => {
  const { threadId, commentId } = req.params;
  const { username, role } = req.body; // Expecting role = 'student' | 'educator'

  if (!username || !role) {
     res.status(400).json({ error: "Missing username or role" });
     return;
  }

  try {
    const thread = await Discussion.findById(threadId);
    if (!thread) {
      
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    const comment = thread.comments.id(commentId);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const isEducator = role === "educator";
    const isCommentOwner = comment.username === username;

    if (!isEducator && !isCommentOwner) {
      res.status(403).json({ error: "Unauthorized to delete this comment" });
      return;
    }

    // Remove the comment
    thread.comments.pull(commentId);
    await thread.save();

    res.status(200).json({ message: "Comment deleted", thread });
  } catch (err) {
    console.error("Failed to delete comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /discuss/thread/:threadId/comment/:commentId/reply/:replyId
router.delete("/thread/:threadId/comment/:commentId/reply/:replyId", async (req, res) => {  
  const { threadId, commentId, replyId } = req.params;
  const { username, role } = req.body; // Expecting role = 'student' | 'educator'

  if (!username || !role) {
    res.status(400).json({ error: "Missing username or role" });
    return;
  }

  try {
    const thread = await Discussion.findById(threadId);
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    const comment = thread.comments.id(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }
    const isEducator = role === "educator";
    const isReplyOwner = reply.username === username;
    if (!isEducator && !isReplyOwner) {
      res.status(403).json({ error: "Unauthorized to delete this reply" });
      return;
    }
    // Remove the reply
    comment.replies.pull(replyId);
    await thread.save();
    res.status(200).json({ message: "Reply deleted", thread });
  } catch (err) {
    console.error("Failed to delete reply:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
);


export default router;