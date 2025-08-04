// routes/auth.js
import express from "express";
import {
  register,
  login,
  logout,
  changePassword,
} from "../controller/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/change-password", changePassword);

export default router;
