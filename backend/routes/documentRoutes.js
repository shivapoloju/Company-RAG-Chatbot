import express from "express";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { uploadDocument, getChatDocuments } from "../controllers/documentController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/chat/:chatId",
  protect,
  getChatDocuments
);

export default router;