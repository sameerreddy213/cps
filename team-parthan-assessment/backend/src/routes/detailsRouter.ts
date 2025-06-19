import express from 'express';
import { details, uploadPhoto } from '../controllers/userDetailsController';
import { auth } from '../middlewares/authMiddleware';
const router= express.Router();

// router.get("/", auth, (req, res) => {
//       res.json((req as any).user); // or cast to AuthRequest if needed
// });

router.get("/", auth, details);
router.post('/upload-photo',auth,uploadPhoto);

export default router;