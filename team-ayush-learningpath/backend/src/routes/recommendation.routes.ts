import express from "express";
import { getRecommendation } from "../controllers/recommendationController";

const router = express.Router();

/**
 * @route GET /api/recommendation/:userId/:goalConceptId
 * @desc Get personalized shortest path recommendation for a user
 */
router.get("/:userId/:goalConceptId", getRecommendation);

export default router;
