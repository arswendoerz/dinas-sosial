import express from "express";
import dotenv from "dotenv";
import authRoutes from "./route/auth.js"; // ⬅️ pastikan path benar

dotenv.config(); // ⬅️ tambahkan tanda kurung!

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use("/api/auth", authRoutes); // ✅ tambahkan middleware router
app.use("/uploads", express.static("uploads"));

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Anda berhasil keluar!",
  });
});

app.get("/", (req, res) => {
  res.send("Selamat Datang Dinas Sosial");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
