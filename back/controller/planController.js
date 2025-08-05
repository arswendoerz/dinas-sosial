import db from "../firestore.js";
import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

const citraCollection = db.collection("perencnaan-documentation");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

function extractFileId(url) {
  const regexList = [/id=([^&/]+)/, /\/d\/([a-zA-Z0-9_-]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
}

const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp._seconds) return null;
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
};

export const createCitra = async (req, res) => {
  try {
    if (!req.user || req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak valid atau tidak ditemukan.",
      });
    }
    const { nama, kategori, tanggalKegiatan } = req.body;

    let citraUrl = null;
    if (req.file) {
      const uploaded = await drive.files.create({
        requestBody: {
          name: req.file.originalname,
          parents: [process.env.DRIVE_FOLDER_ID_CITRA],
        },
        media: {
          mimeType: req.file.mimetype,
          body: Readable.from(req.file.buffer),
        },
        fileds: "id",
      });

      citraUrl = `https://drive.google.com/uc?id=${uploaded.data.id}`;
    }

    const now = new Date();
    const citraRef = citraCollection.doc();

    const citraData = {
      id: citraRef.id,
      nama,
      kategori,
      tanggalKegiatan,
      citraUrl: citraUrl || null,
      tanggalUpload: now,
      tanggalUpdate: now,
      role: req.user.role,
    };

    await citraRef.set(citraData);

    res.status(201).json({
      success: true,
      messgae: "Dokumentasi kegiatan anda berhasil dibuat",
      data: {
        ...citraData,
        tanggalUpload: formatTimestamp(now),
        tanggalUpdate: formatTimestamp(now),
      },
    });
  } catch (error) {
    console.error("Error creating citra:", error);
    res.status(500).json({
      success: false,
      message: "Maaf!! Anda gagal menambahkan dokumentasi kegiatan",
    });
  }
};

export const getAllCitra = async (req, res) => {
  try {
    const snapshot = await citraCollection
      .orderBy("tanggalKegiatan", "desc")
      .get();
    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada dokumentasi kegiatan ditemukan",
      });
    }

    const citraList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      };
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua dokumentasi kegiatan",
      data: citraList,
    });
  } catch (error) {
    console.error("Error fetching all documentation:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil dokumentasi kegiatan",
    });
  }
};

export const getCitraById = async (req, res) => {
  try {
    const citraDoc = await citraCollection.doc(req.params.id).get();
    if (!citraDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Dokumentasi kegiatan tidak ditemukan",
      });
    }

    const data = citraDoc.data();
    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan dokumentasi kegiatan",
      data: {
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      },
    });
  } catch (error) {
    console.error("Error fetching citra by ID:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil dokumentasi kegiatan",
    });
  }
};

export const updateCitra = async (req, res) => {
  try {
    const citraRef = citraCollection.doc(req.params.id);
    const citraDoc = await citraRef.get();

    if (!citraDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Dokumentasi kegiatan tidak ditemukan",
      });
    }

    const citra = citraDoc.data();

    if (citra.userId !== req.user.userId && citra.role !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengubah dokumentasi ini",
      });
    }

    let citraUrl = citra.citraUrl || "";
    const oldFileId = extractFileId(citraUrl);

    if (req.file) {
      let newFile;

      if (oldFileId) {
        // Jika sudah ada foto sebelumnya, update foto lama
        newFile = await drive.files.update({
          fileId: oldFileId,
          requestBody: {
            name: req.file.originalname,
          },
          media: {
            mimeType: req.file.mimetype,
            body: Readable.from(req.file.buffer),
          },
          fields: "id",
        });
      } else {
        // Jika belum ada foto/video sebelumnya, upload file baru
        newFile = await drive.files.create({
          requestBody: {
            name: req.file.originalname,
            mimeType: req.file.mimetype,
          },
          media: {
            mimeType: req.file.mimetype,
            body: Readable.from(req.file.buffer),
          },
          fields: "id",
        });
      }

      citraUrl = `https://drive.google.com/uc?id=${newFile.data.id}`;
    }

    const now = new Date();
    const updateData = {
      ...req.body,
      citraUrl,
      tanggalUpdate: now,
    };

    await citraRef.update(updateData);

    const updateCitra = await citraRef.get();
    const updated = updateCitra.data();

    res.status(200).json({
      success: true,
      message: "Dokumentasi kegiatan berhasil diperbarui",
      data: {
        ...updated,
        tanggalUpload: formatTimestamp(updated.tanggalUpload),
        tanggalUpdate: formatTimestamp(updated.tanggalUpdate),
      },
    });
  } catch (error) {
    console.error("Gagal memperbarui dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui dokumentasi kegiatan",
    });
  }
};
// export const deleteCitra = async (req, res) => {};
// export const searchCitra = async (req, res) => {};
