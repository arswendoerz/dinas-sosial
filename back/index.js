import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Tambahkan import cors
import authRoutes from "./route/auth.js";
import userRoutes from "./route/user.js";
import docsRoutes from "./route/docs.js";
import letterRoutes from "./route/letter.js";
import recipiRoutes from "./route/resos.js";
import cookieParser from "cookie-parser";
import proxyRoute from "./route/proxy.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dinas-sosial-nu.vercel.app",
      "dinas-sosial-git-main-arswendo-erzas-projects.vercel.app",
      "dinas-sosial-lxg3l1z7j-arswendo-erzas-projects.vercel.app",
      "https://dinas-sosial-arswendo-erzas-projects.vercel.app/",
      "https://www.sosialink.web.id",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes); // Autentikasi
app.use("/api/user", userRoutes); // Account
app.use("/api/docs", docsRoutes); // Document
app.use("/api/letter", letterRoutes); // Letter
app.use("/api/recipi", recipiRoutes); // Recipient Resos
app.use("/proxy", proxyRoute);

app.get("/", (req, res) => {
  res.send("Selamat Datang Dinas Sosial");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
