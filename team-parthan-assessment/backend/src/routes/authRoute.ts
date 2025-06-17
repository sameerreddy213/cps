import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();
// Public routes
router.post("/signup", (req, res, next) => {
	Promise.resolve(signup(req, res)).catch(next);
});
router.post("/login", (req, res, next) => {
	Promise.resolve(login(req, res)).catch(next);
});


export default router;