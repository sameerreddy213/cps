import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.post("/register", (req, res, next) => {
	Promise.resolve(register(req, res)).catch(next);
});
router.post("/login", (req, res, next) => {
	Promise.resolve(login(req, res)).catch(next);
});

// Protected routes
router.post("/logout", authMiddleware, (req, res, next) => {
	Promise.resolve(logout(req, res)).catch(next);
});
router.get("/me", authMiddleware, getCurrentUser);

export default router;
//Added by Adwaidh
