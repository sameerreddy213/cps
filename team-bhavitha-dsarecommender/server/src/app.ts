// src/app.ts

import express from "express";
import bodyParser from "body-parser";
import learningPathRoutes from "./routes/learningPath";
import cors from 'cors';
import authRoutes from './routes/auth';
import quizRoutes from "./routes/quiz";
import quizSubmitRoutes from "./routes/quizSubmit";
import dotenv from "dotenv";
import connectDB from "./config/db";
import quizHistoryRoutes from "./routes/quizHistory";
import recommendationRoutes from "./routes/recommendation";
import exploreRoutes from "./routes/explore";
import discussionRoutes from "./routes/discuss";
import questionRoutes from "./routes/question";
import reportRoutes from "./routes/report";
import educatorRoutes from "./routes/educator";
import Dhruv from "./routes/Dhruv";
//dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config();

const app = express();
const PORT = 5000;
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",  // for local dev
      "https://cps2-rust.vercel.app", // your deployed frontend
    ],
    credentials: true,
  })
);


app.use("/api/explore", exploreRoutes);
app.use("/api", learningPathRoutes);
//app.use('/api', authRoutes);
//app.use("/api/quiz", quizRoutes);
app.use("/api", Dhruv);
app.use("/api/quiz-history", quizHistoryRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api", quizSubmitRoutes);
app.use("/api", quizRoutes);
app.use("/api", quizSubmitRoutes);
app.use("/api", authRoutes);
app.use("/api/discuss", discussionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", educatorRoutes);


connectDB(); // before app.listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

