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
      console.error(
        `Gagal mengambil gambar dari GDrive. Status: ${response.status}`
      );
      return res
        .status(response.status)
        .send("Gagal mengambil gambar dari GDrive");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);

    response.body.pipe(res);
  } catch (err) {
    console.error("Gagal saat proxy gambar:", err.message);
    res.status(500).send("Terjadi kesalahan internal saat menampilkan gambar");
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

    const fetchHeaders = {};
    if (range) {
      fetchHeaders.Range = range;
    }

    const gdriveResponse = await fetch(gdriveUrl, { headers: fetchHeaders });

    if (!gdriveResponse.ok) {
      const errorText = await gdriveResponse.text();
      console.error(
        "Google Drive response error:",
        gdriveResponse.status,
        errorText
      );
      return res
        .status(gdriveResponse.status)
        .send("Gagal mengambil video dari GDrive");
    }

    const contentType =
      gdriveResponse.headers.get("content-type") || "video/mp4";
    const contentLength = gdriveResponse.headers.get("content-length");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");

    if (range) {
      const contentRange = gdriveResponse.headers.get("content-range");
      res.status(206);

      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
      }
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
    } else {
      res.status(200);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
    }
    gdriveResponse.body.pipe(res);
  } catch (err) {
    console.error("Gagal saat proxy video:", err.message);
    res.status(500).send("Terjadi kesalahan internal saat menampilkan video");
  }
});

export default router;
