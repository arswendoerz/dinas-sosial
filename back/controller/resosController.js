import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";
import db from "../firestore.js";
import { createObjectCsvStringifier } from "csv-writer";

dotenv.config();

const recipiCollection = db.collection("recipient");

const oauth2client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2client });

const extractFileId = (url) => {
  if (!url) return null;
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

export const createRecipi = async (req, res) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak valid atau tidak ditemukan.",
      });
    }

    const {
      nama,
      alamat,
      kota,
      usia,
      nik,
      telepon,
      jenisAlat,
      keterangan,
      tanggalPenerimaan,
    } = req.body;

    let fotoUrl = null;
    let fileId = null;

    if (req.file) {
      const uploaded = await drive.files.create({
        requestBody: {
          name: req.file.originalname,
          parents: [process.env.DRIVE_FOLDER_ID_RECIPI],
        },
        media: {
          mimeType: req.file.mimetype,
          body: Readable.from(req.file.buffer),
        },
        fields: "id",
      });

      fileId = uploaded.data.id;
      fotoUrl = `https://drive.google.com/file/d/${fileId}/view`;
    }

    const now = new Date();
    const recRef = recipiCollection.doc();

    const data = {
      id: recRef.id,
      nama,
      alamat,
      kota,
      usia: parseInt(usia),
      nik,
      telepon,
      jenisAlat,
      keterangan: keterangan || null,
      tanggalPenerimaan,
      tanggalUpload: now,
      tanggalUpdate: now,
      role: req.user.role,
      fotoUrl: fotoUrl || null,
      fileId: fileId || null,
    };

    await recRef.set(data);

    res.status(201).json({
      success: true,
      message: "Penerima berhasil ditambahkan",
      data: {
        ...data,
        tanggalUpload: formatTimestamp(now),
        tanggalUpdate: formatTimestamp(now),
      },
    });
  } catch (error) {
    console.error("Error createRecipi:", error);
    res.status(500).json({
      success: false,
      message: "Maaf!! Anda gagal menambahkan penerima",
    });
  }
};

export const getAllRecipies = async (req, res) => {
  try {
    const snapshot = await recipiCollection.get();

    const recipiList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      };
    });

    res.status(200).json({
      success: true,
      data: recipiList,
    });
  } catch (error) {
    console.error("Gagal mengambil data para penerima:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data para penerima",
    });
  }
};

export const getRecipientById = async (req, res) => {
  try {
    const doc = await recipiCollection.doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({
        success: false,
        message: "Data penerima tidak ditemukan",
      });

    const data = doc.data();
    res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        tanggalUpload: formatTimestamp(data.tanggalUpload),
        tanggalUpdate: formatTimestamp(data.tanggalUpdate),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data penerima",
    });
  }
};

export const updateRecipi = async (req, res) => {
  try {
    const recRef = recipiCollection.doc(req.params.id);
    const doc = await recRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Data warga tidak ditemukan",
      });
    }

    const recipi = doc.data();

    // Akses kontrol
    if (recipi.userId !== req.user.userId && recipi.role !== req.user.role) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    let fotoUrl = recipi.fotoUrl || "";
    let fileId = recipi.fileId || null;

    // Jika ada file baru diunggah
    if (req.file) {
      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: "File ID tidak ditemukan dalam data lama",
        });
      }

      // Hapus file lama
      await drive.files.delete({ fileId });

      // Upload file baru
      const uploaded = await drive.files.create({
        requestBody: {
          name: req.file.originalname,
          parents: [process.env.DRIVE_FOLDER_ID_RECIPI],
        },
        media: {
          mimeType: req.file.mimetype,
          body: Readable.from(req.file.buffer),
        },
        fields: "id",
      });

      // Set file baru
      fileId = uploaded.data.id;
      fotoUrl = `https://drive.google.com/file/d/${fileId}/view`;
    }

    const updateData = {
      ...req.body,
      tanggalUpdate: new Date(),
    };

    // Update file info jika diunggah ulang
    if (req.file) {
      updateData.fotoUrl = fotoUrl;
      updateData.fileId = fileId;
    }

    await recRef.update(updateData);

    const updateRecipi = await recRef.get();
    const updated = updateRecipi.data();

    res.status(200).json({
      success: true,
      message: "Data penerima telah berhasil diperbarui",
      data: {
        ...updated,
        tanggalUpload: formatTimestamp(updated.tanggalUpload),
        tanggalUpdate: formatTimestamp(updated.tanggalUpdate),
      },
    });
  } catch (error) {
    console.error("Gagal memperbarui data warga:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui data warga",
    });
  }
};

export const deleteRecipient = async (req, res) => {
  try {
    const recipientRef = recipiCollection.doc(req.params.id);
    const recipientSnap = await recipientRef.get();

    if (!recipientSnap.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Data penerima tidak ditemukan" });
    }

    const recipientData = recipientSnap.data();

    // Validasi akses: hanya bisa dihapus oleh pemilik atau role yang sama
    if (
      recipientData.userId !== req.user.userId &&
      recipientData.role !== req.user.role
    ) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    // Hapus file di Google Drive jika ada
    const fileId = extractFileId(recipientData.url);
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

    // Hapus data di Firestore
    await recipientRef.delete();

    res.status(200).json({
      success: true,
      message: "Data penerima berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus data penerima:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus data penerima",
    });
  }
};

export const searchRecipi = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query pencarian tidak boleh kosong",
      });
    }

    const snapshot = await recipiCollection
      .where("role", "==", req.user.role)
      .get();

    const searchText = query.toLowerCase();

    const results = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          tanggalUpload: formatTimestamp(data.tanggalUpload),
          tanggalUpdate: formatTimestamp(data.tanggalUpdate),
        };
      })
      .filter((recipi) => {
        return (
          recipi.nama?.toLowerCase().includes(searchText) ||
          recipi.nik?.toLowerCase().includes(searchText)
        );
      });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Gagal melakukan pencarian penerima:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari data penerima",
    });
  }
};

export const exportRecipi = async (req, res) => {
  try {
    const snapshot = await recipiCollection
      .where("role", "==", req.user.role)
      .get();
    const recipiList = snapshot.docs.map((doc) => doc.data());

    if (recipiList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data penerima tidak ditemukan woii",
      });
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "nama", title: "Nama" },
        { id: "alamat", title: "Alamat" },
        { id: "kota", title: "Kabupaten/Kota" },
        { id: "usia", title: "Usia" },
        { id: "nik", title: "NIK" },
        { id: "telepon", title: "No. Telepon" },
        { id: "status_dtks", title: "DTKS / Non DTKS" },
        { id: "role", title: "Role" },
        { id: "fotoUrl", title: "Link Foto" },
      ],
    });

    const records = recipiList.map((recipi) => ({
      nama: (recipi.nama || "").toString().trim(),
      alamat: (recipi.alamat || "").toString().trim(),
      kota: (recipi.kota || "").toString().trim(),
      usia: recipi.usia?.toString().trim() || "",
      nik: (recipi.nik || "").toString().trim(),
      telepon: (recipi.telepon || "").toString().trim(),
      status_dtks: recipi.status_dtks ? "DTKS" : "Non DTKS",
      role: (recipi.role || "").toString().trim(),
      fotoUrl: (recipi.fotoUrl || "").toString().trim(),
    }));

    const csvData =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=recipi.csv");

    const stream = Readable.from([csvData]);
    stream.pipe(res);
  } catch (error) {
    console.error("Gagal export CSV:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengekspor CSV",
    });
  }
};
