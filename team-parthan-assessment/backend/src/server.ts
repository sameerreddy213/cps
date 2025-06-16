import express, { json, Request, Response, NextFunction } from "express";
import cors from "cors";
<<<<<<< HEAD:team-parthan-assessment/backend/src/server.ts
import authRoutes from "./routes/authRoute";
import analyzeRoute from "./routes/analyzeRoute";
=======
import apiRoutes from "./routes/api";
import authRoutes from "./routes/authRoute";
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/server.ts

const app = express();

app.use(cors());
app.use(json());
<<<<<<< HEAD:team-parthan-assessment/backend/src/server.ts
app.use("/api", analyzeRoute);
=======
app.use("/api", apiRoutes);
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/server.ts
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
