import express from "express";
import {
  createLetter,
  getAllLetters,
  getLetterById,
  updateLetter,
  deleteLetter,
  searchLetters,
} from "../controller/letterController.js";
import { protect } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), createLetter);
router.get("/search", searchLetters);
router.post("/", createLetter);
router.get("/", getAllLetters);
router.get("/:id", getLetterById);
router.put("/:id", upload.single("file"), updateLetter);
router.delete("/:id", deleteLetter);

export default router;
