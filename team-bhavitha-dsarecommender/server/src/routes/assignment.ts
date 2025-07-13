import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Assignment } from "../models/assignment";

const router = express.Router();

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { username, title, description } = req.body;

    if (!username || !title || !description || !req.file) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Absolute file URL using host + protocol
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const assignment = new Assignment({
      username,
      title,
      description,
      fileUrl,
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error("Error saving assignment:", err);
    res.status(500).json({ error: "Failed to save assignment" });
  }
});
//Get all assignments for a student
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const assignments = await Assignment.find({ username }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error("Failed to fetch assignments", err);
    res.status(500).json({ error: "Could not fetch assignments" });
  }
});

export default router;
