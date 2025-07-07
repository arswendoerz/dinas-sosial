import express from "express";
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
} from "../controller/docController.js";
import { protect } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), createDocument);

router.get("/search", searchDocuments); // ← pindah ke atas
router.post("/", createDocument);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
