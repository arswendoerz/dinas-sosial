import express from "express";
import dotenv from "dotenv";
import authRoutes from "./route/auth.js";
import userRoutes from "./route/user.js";
<<<<<<< HEAD
import docsRoutes from "./route/docs.js";
=======
>>>>>>> 5e05e11 (Update API & Add Endpoint Get Profile)
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRoutes);

app.use("/api/user", userRoutes);

app.use("/api/docs", docsRoutes);

app.get("/", (req, res) => {
  res.send("Selamat Datang Dinas Sosial");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
