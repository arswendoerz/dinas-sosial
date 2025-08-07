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

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);

    response.body.pipe(res);
  } catch (err) {
    console.error("Gagal proxy gambar:", err.message);
    res.status(500).send("Gagal menampilkan gambar");
  }
});

router.get("/video/:fileId", async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).send("File ID tidak ditemukan");
  }

  try {
    const gdriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const range = req.headers.range;

    const headers = {};
    if (range) {
      headers.Range = range;
    }

    const response = await fetch(gdriveUrl, { headers });

    if (!response.ok) {
      return res.status(500).send("Gagal mengambil video dari GDrive");
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");

    res.status(range ? 206 : 200);
    res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (range) res.setHeader("Accept-Ranges", "bytes");

    response.body.pipe(res);
  } catch (err) {
    console.error("Gagal proxy video:", err.message);
    res.status(500).send("Gagal menampilkan video");
  }
});

export default router;
