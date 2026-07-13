import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createSession,
  listSessions,
  getSession,
  deleteSession,
  addMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, listSessions);
router.get("/:id", protect, getSession);
router.delete("/:id", protect, deleteSession);
router.post("/:id/message", protect, addMessage);

export default router;
