import express, { json, Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/authRoute";

const app = express();

app.use(cors());
app.use(json());
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
