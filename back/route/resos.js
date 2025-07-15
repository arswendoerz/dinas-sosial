import express from "express";
import { protect } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";
import {
  createRecipi,
  getAllRecipies,
  getRecipientById,
  updateRecipi,
  deleteRecipient,
  searchRecipi,
  exportRecipi,
} from "../controller/resosController.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), createRecipi);
router.get("/search", searchRecipi);
router.post("/", createRecipi);
router.get("/export", exportRecipi);
router.get("/", getAllRecipies);
router.get("/:id", getRecipientById);
router.put("/:id", upload.single("file"), updateRecipi);
router.delete("/:id", deleteRecipient);

export default router;
