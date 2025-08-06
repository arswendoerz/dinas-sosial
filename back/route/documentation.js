import express from "express";
import {
  createCitra,
  getAllCitra,
  getCitraById,
  updateCitra,
  deleteCitra,
  searchCitra,
} from "../controller/documentationController.js";
import { protect } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), createCitra);
router.get("/search", searchCitra);
router.get("/", getAllCitra);
router.get("/:id", getCitraById);
router.put("/:id", upload.single("file"), updateCitra);
router.delete("/:id", deleteCitra);

export default router;
