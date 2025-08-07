import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";
import db from "../firestore.js";

dotenv.config();

const lettersCollection = db.collection("letters");

const oauth2client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2client });

const extractFileId = (url) => {
  const regexList = [/id=([^&/]+)/, /\/d\/([a-zA-Z0-9_-]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
};

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

export const createLetter = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File surat wajib diunggah!" });
    }

    const media = {
      mimetype: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const file = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: [process.env.DRIVE_FOLDER_ID_SURAT],
      },
      media,
      fields: "id",
    });

    const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
    const now = new Date();

    const letRef = lettersCollection.doc();
    const letData = {
      id: letRef.id,
      nomor,
      nama,
      perihal,
      kategori,
      jenis: req.file.mimetype,
      url: fileUrl,
      userId: req.user.userId,
      role: req.user.role,
      tanggalUpload: now,
    };

    await letRef.set(letData);

    res.status(201).json({
      success: true,
      message: "Surat berhasil dibuat",
      data: {
        ...letData,
        tanggalUpload: formatTimestamp(now),
        tanggalUpdate: formatTimestamp(now),
      },
    });
  } catch (error) {
    console.error("Gagal membuat surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat surat",
    });
  }
};

export const getAllLetters = async (req, res) => {
  try {
    const snapshot = await lettersCollection
      .where("role", "==", req.user.role)
      .get();

    const letters = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      };
    });

    res.status(200).json({ success: true, data: letters });
  } catch (error) {
    console.error("Error mengambil surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil surat",
    });
  }
};

export const getLetterById = async (req, res) => {
  try {
    const doc = await lettersCollection.doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Surat tidak ditemukan",
      });
    }

    const data = doc.data();

    // Cek apakah user berhak melihat data ini
    if (data.userId !== req.user.userId && data.role !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      },
    });
  } catch (error) {
    console.error("Gagal mengambil surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan dalam mengambil surat",
    });
  }
};

export const updateLetter = async (req, res) => {
  try {
    const letRef = lettersCollection.doc(req.params.id);
    const doc = await letRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    const letter = doc.data();

    if (letter.userId !== req.user.userId && letter.role !== req.user.role) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    let fileUrl = letter.url;
    let jenis = letter.jenis;
    const oldFileId = extractFileId(fileUrl);

    if (req.file) {
      if (!oldFileId) {
        return res
          .status(400)
          .json({ success: false, message: "File ID tidak ditemukan" });
      }

      const newFile = await drive.files.update({
        fileId: oldFileId,
        requestBody: { name: req.file.originalname },
        media: {
          mimeType: req.file.mimetype,
          body: Readable.from(req.file.buffer),
        },
        fields: "id",
      });

      fileUrl = `https://drive.google.com/file/d/${newFile.data.id}/view`;
      jenis = req.file.mimetype;
    }

    const updateData = {
      ...req.body,
      url: fileUrl,
      jenis,
      tanggalUpdate: new Date(),
      updatedBy: req.user.nama,
    };

    await letRef.update(updateData);

    const updatedDoc = await letRef.get();
    res.status(200).json({
      success: true,
      message: "Surat berhasil diperbarui",
      data: {
        ...updatedDoc.data(),
        tanggalUpload: formatTimestamp(updatedDoc.data().tanggalUpload),
        tanggalUpdate: formatTimestamp(updatedDoc.data().tanggalUpdate),
        updatedBy: updatedDoc.data().updatedBy,
      },
    });
  } catch (error) {
    console.error("Gagal memperbarui surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui surat",
    });
  }
};

export const deleteLetter = async (req, res) => {
  try {
    const letRef = lettersCollection.doc(req.params.id);
    const doc = await letRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Surat tidak ditemukan" });
    }

    const letter = doc.data();

    if (letter.userId !== req.user.userId && letter.role !== req.user.role) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    const fileId = extractFileId(letter.url);

    if (fileId) {
      try {
        await drive.files.delete({ fileId });
      } catch (error) {
        console.warn("Gagal menghapus file dari Google Drive:", error.message);
      }
    }

    await letRef.delete();

    res.status(200).json({ success: true, message: "Surat berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan dalam menghapus surat",
    });
  }
};

export const searchLetters = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query pencarian tidak boleh kosong",
      });
    }

    const snapshot = await lettersCollection
      .where("role", "==", req.user.role)
      .get();

    const results = snapshot.docs
      .map((doc) => doc.data())
      .filter((doc) =>
        [doc.nama, doc.nomor, doc.perihal, doc.kategori].some((field) =>
          field?.toLowerCase().includes(query.toLowerCase())
        )
      );

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Gagal mencari surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari surat",
    });
  }
};
