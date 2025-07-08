import express from "express";
import User from "../models/users";

const router = express.Router();


router.get("/educator/students", async (req, res) => {
  try {
    const students = await User.find({
      $or: [
        { role: "student" },
        { role: { $exists: false } },
        { role: null },
      ],
    }).select("username lastActive progress mastery");

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;
