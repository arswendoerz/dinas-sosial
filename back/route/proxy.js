import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/image/:fileId", async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).send("File ID tidak ditemukan");
  }

  try {
    const gdriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await fetch(gdriveUrl);

    if (!response.ok) {
      return res.status(500).send("Gagal mengambil gambar dari GDrive");
    }

    // Ambil Content-Type dari GDrive
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);

    response.body.pipe(res);
  } catch (err) {
    console.error("Gagal proxy gambar:", err.message);
    res.status(500).send("Gagal menampilkan gambar");
  }
});

export default router;
