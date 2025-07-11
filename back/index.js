import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Tambahkan import cors
import authRoutes from "./route/auth.js";
import userRoutes from "./route/user.js";
import docsRoutes from "./route/docs.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/docs", docsRoutes);

app.get("/", (req, res) => {
  res.send("Selamat Datang Dinas Sosial");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});