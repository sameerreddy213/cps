import { Router } from 'express';
const router = Router();
import analyzeController from '../controllers/analyzeController';
import { generate } from '../controllers/quizController';
import upload from '../middlewares/uploadMiddleware';


router.post('/analyze', upload.single('file'), async (req, res, next) => {
	try {
		await analyzeController(req, res);
	} catch (err) {
		next(err);
	}
});
router.post('/generate-quiz', generate);

export default router;
