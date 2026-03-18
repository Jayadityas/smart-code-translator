//Public routes like register, login,google do not require authentication, but protected routes
//like profile, logout need authentication and then need Auth middleware 


//here we map each controller to the APIs
import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (no auth needed)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Protected routes (auth required)
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;