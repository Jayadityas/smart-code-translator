//central route registry
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import historyRoutes from "./history.routes.js"; 
import codeRoutes from "./code.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/history", historyRoutes);             
router.use("/code", codeRoutes);

export default router;