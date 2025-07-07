import Document from "../model/document.model.js";
import { Op } from "sequelize";
import path from "path";

export const createDocument = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File dokumen wajib diunggah!",
      });
    }

    const document = await Document.create({
      nomor,
      nama,
      perihal,
      kategori,
      jenis: req.file.mimetype, // otomatis dari file
      url: `/uploads/${req.file.filename}`,
      userId: req.userId,
      tanggalUpload: new Date().toISOString().split("T")[0],
      tanggalUpdate: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      success: true,
      message: "Dokumen berhasil dibuat",
      data: document,
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
    const document = await Document.findAll({
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil dokumen",
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      data: document,
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
    const update = await Document.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (update[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan atau tidak ada perubahan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui",
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
    const deleted = await Document.destroy({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan atau sudah terhapus",
      });
    }
    res.status(200).json({
      success: true,
      message: "Dokumen telah berhasil dihapus",
    });
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

    const documents = await Document.findAll({
      where: {
        userId: req.user.userId,
        [Op.or]: [
          { nama: { [Op.like]: `%${query}%` } },
          { perihal: { [Op.like]: `%${query}%` } },
          { kategori: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Gagal mencari dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari dokumen",
    });
  }
};
