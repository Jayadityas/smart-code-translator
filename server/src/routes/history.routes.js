import { Router } from "express";
import {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/history.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getHistory);

// IMPORTANT: /clear must come BEFORE /:id

/*Why? Because Express matches routes top-to-bottom. If /:id came first, a request 
to /clear would match /:id with id = "clear" — and try to find a history entry with ID "clear" instead of clearing all history. */
router.delete("/clear", clearHistory);

router.get("/:id", getHistoryItem);
router.delete("/:id", deleteHistoryItem);

export default router;