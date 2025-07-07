import express from "express";
import dotenv from "dotenv";
import authRoutes from "./route/auth.js";
import userRoutes from "./route/user.js";
import docsRoutes from "./route/docs.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/docs", docsRoutes);
