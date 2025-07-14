import db from "../firestore.js";
import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

const documentsCollection = db.collection("documents");

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

export const createDocument = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "File dokumen wajib diunggah!" });

    const media = {
      mimetype: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const file = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: [process.env.DRIVE_FOLDER_ID_DOK],
      },
      media,
      fields: "id",
    });

    const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
    const now = new Date();

    const docRef = documentsCollection.doc();
    const docData = {
      id: docRef.id,
      nomor,
      nama,
      perihal,
      kategori,
      jenis: req.file.mimetype,
      url: fileUrl,
      userId: req.user.userId,
      role: req.user.role,
      tanggalUpload: now,
      tanggalUpdate: now,
    };

    await docRef.set(docData);
    res.status(201).json({
      success: true,
      message: "Dokumen berhasil dibuat",
      data: {
        ...docData,
        tanggalUpload: formatTimestamp(now),
        tanggalUpdate: formatTimestamp(now),
      },
    });
  } catch (error) {
    console.error("Gagal membuat dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat dokumen",
    });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const snapshot = await documentsCollection
      .where("role", "==", req.user.role)
      .get();

    const docs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      };
    });

    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Gagal mengambil dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil dokumen",
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const docRef = documentsCollection.doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists || docSnap.data().role !== req.user.role) {
      return res
        .status(404)
        .json({ success: false, message: "Dokumen tidak ditemukan" });
    }
    const data = docSnap.data();

    const formattedData = {
      ...data,
      tanggalUpload: formatTimestamp(data.tanggalUpload),
      tanggalUpdate: formatTimestamp(data.tanggalUpdate),
    };

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Gagal mengambil dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil dokumen",
    });
  }
};
export const updateDocument = async (req, res) => {
  try {
    const docRef = documentsCollection.doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data().role !== req.user.role) {
      return res
        .status(404)
        .json({ success: false, message: "Dokumen tidak ditemukan" });
    }

    let fileUrl = docSnap.data().url;
    let jenis = docSnap.data().jenis;
    const oldFileId = extractFileId(fileUrl);

    if (req.file) {
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

    const now = new Date();
    const updateData = {
      ...req.body,
      url: fileUrl,
      jenis,
      tanggalUpdate: now,
    };

    await docRef.update(updateData);
    const updatedSnap = await docRef.get();
    const updatedData = updatedSnap.data();

    res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui",
      data: {
        ...updatedData,
        tanggalUpdate: formatTimestamp(updatedData.tanggalUpdate),
        tanggalUpload: formatTimestamp(updatedData.tanggalUpload),
      },
    });
  } catch (error) {
    console.error("Gagal memperbarui dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui dokumen",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const docRef = documentsCollection.doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists || docSnap.data().role !== req.user.role) {
      return res
        .status(404)
        .json({ success: false, message: "Dokumen tidak ditemukan" });
    }

    const fileId = extractFileId(docSnap.data().url);
    if (fileId) {
      try {
        await drive.files.delete({ fileId });
      } catch (err) {
        console.warn(
          "File tidak berhasil dihapus dari Google Drive:",
          err.message
        );
      }
    }

    await docRef.delete();
    res
      .status(200)
      .json({ success: true, message: "Dokumen telah berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus dokumen",
    });
  }
};

export const searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query pencarian tidak boleh kosong",
      });
    }

    const snapshot = await documentsCollection
      .where("role", "==", req.user.role)
      .get();

    const q = query.toLowerCase();

    const result = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          tanggalUpload: formatTimestamp(data.tanggalUpload),
          tanggalUpdate: formatTimestamp(data.tanggalUpdate),
        };
      })
      .filter((doc) => {
        return (
          doc.nama?.toLowerCase().includes(q) ||
          doc.nomor?.toLowerCase().includes(q) ||
          doc.perihal?.toLowerCase().includes(q) ||
          doc.kategori?.toLowerCase().includes(q)
        );
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Gagal mencari dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari dokumen",
    });
  }
};
