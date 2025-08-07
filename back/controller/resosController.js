import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";
import db from "../firestore.js"; // Pastikan ini mengarah ke inisialisasi Firestore Anda
// import { createObjectCsvStringifier } from "csv-writer";
import ExcelJS from "exceljs";

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

      fotoUrl = `https://drive.google.com/uc?id=${uploaded.data.id}`;
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
      role: req.user.role,
      fotoUrl: fotoUrl || null,
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
    const snapshot = await recipiCollection
      .orderBy("tanggalPenerimaan", "desc")
      .get();

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
    const oldFileId = extractFileId(fotoUrl);

    // Jika ada file baru diunggah
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
        // Jika belum ada foto sebelumnya, upload file baru
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

      fotoUrl = `https://drive.google.com/uc?id=${newFile.data.id}`;
    }

    const now = new Date();

    const updateData = {
      ...req.body,
      fotoUrl,
      tanggalUpdate: now,
      updatedBy: req.user.nama,
    };

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
        updatedBy: updated.updatedBy,
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
    const fileId = extractFileId(recipientData.fotoUrl);
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

    const snapshot = await recipiCollection.get();

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
    const { search, kota, year, jenisAlat } = req.query;

    let query = recipiCollection;
    if (kota && kota !== "__semua__") {
      query = query.where("kota", "==", kota);
    }
    if (jenisAlat) {
      query = query.where("jenisAlat", "==", jenisAlat);
    }

    const snapshot = await query.get();
    let recipiList = snapshot.docs.map((doc) => doc.data());

    if (search) {
      const searchTextLower = search.toLowerCase();
      recipiList = recipiList.filter(
        (recipi) =>
          (recipi.nama &&
            recipi.nama.toLowerCase().includes(searchTextLower)) ||
          (recipi.alamat &&
            recipi.alamat.toLowerCase().includes(searchTextLower)) ||
          (recipi.nik && recipi.nik.toLowerCase().includes(searchTextLower)) ||
          (recipi.telepon &&
            recipi.telepon.toLowerCase().includes(searchTextLower)) ||
          (recipi.jenisAlat &&
            recipi.jenisAlat.toLowerCase().includes(searchTextLower)) ||
          (recipi.keterangan &&
            recipi.keterangan.toLowerCase().includes(searchTextLower))
      );
    }

    if (year && year !== "__semua__") {
      recipiList = recipiList.filter(
        (recipi) =>
          recipi.tanggalPenerimaan && recipi.tanggalPenerimaan.includes(year)
      );
    }

    if (recipiList.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Tidak ada data penerima yang ditemukan dengan filter yang diberikan.",
      });
    }

    // --- EXCEL JS ---
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Penerima");

    // set header
    worksheet.columns = [
      { header: "Nama", key: "nama", width: 20 },
      { header: "Alamat", key: "alamat", width: 30 },
      { header: "Kabupaten/Kota", key: "kota", width: 20 },
      { header: "Usia", key: "usia", width: 10 },
      { header: "NIK", key: "nik", width: 18 },
      { header: "No. Telepon", key: "telepon", width: 15 },
      { header: "Keterangan", key: "keterangan", width: 25 },
      { header: "Jenis Alat", key: "jenisAlat", width: 15 },
      { header: "Tanggal Penerimaan", key: "tanggalPenerimaan", width: 20 },
      { header: "Link Foto", key: "fotoUrl", width: 30 },
    ];

    recipiList.forEach((recipi) => {
      worksheet.addRow({
        nama: recipi.nama || "",
        alamat: recipi.alamat || "",
        kota: recipi.kota || "",
        usia: recipi.usia || "",
        nik: recipi.nik || "",
        telepon: recipi.telepon || "",
        keterangan: recipi.keterangan || "",
        jenisAlat: recipi.jenisAlat || "",
        tanggalPenerimaan: recipi.tanggalPenerimaan || "",
        fotoUrl: recipi.fotoUrl || "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const timestamp = new Date().toISOString().split("T")[0];

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="data_penerima_bantuan_filtered_${timestamp}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Gagal export XLSX:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengekspor XLSX",
    });
  }
};
