// import { Router } from 'express';
// import { generateRecommendation } from '../controllers/recommendationController';
// import { protect } from '../middlewares/authMiddleware';

// const router = Router();

// // The route to generate a new recommendation
// router.post('/generate', protect, generateRecommendation);

// export default router;
import express from 'express';
import { getRecommendation } from '../controllers/recommendationController';

const router = express.Router();

router.post('/recommend', getRecommendation);

export default router;
