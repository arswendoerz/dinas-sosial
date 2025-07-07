// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/verifyToken.js";
import { getProfile } from "../controller/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;
