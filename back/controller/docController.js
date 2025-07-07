import Document from "../model/document.model.js";
import { Op } from "sequelize";
<<<<<<< HEAD
import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";
import path from "path";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

function extractFileId(url) {
  const regexList = [
    /id=([^&/]+)/, // cocok untuk uc?id=
    /\/d\/([a-zA-Z0-9_-]+)/, // cocok untuk /file/d/<ID>/
  ];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
}

=======
import path from "path";

>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
export const createDocument = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File dokumen wajib diunggah!",
      });
    }

<<<<<<< HEAD
    const fileMeta = {
      name: req.file.originalname,
      parents: [process.env.DRIVE_FOLDER_ID_DOK],
    };

    const media = {
      mimetype: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const file = await drive.files.create({
      requestBody: fileMeta,
      media: media,
      fields: "id",
    });

    const fileId = file.data.id;
    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

    // Simpan metadata file ke dalam database (Firestore)
=======
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
    const document = await Document.create({
      nomor,
      nama,
      perihal,
      kategori,
      jenis: req.file.mimetype, // otomatis dari file
<<<<<<< HEAD
      url: fileUrl,
=======
      url: `/uploads/${req.file.filename}`,
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
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
<<<<<<< HEAD
    const existingDocument = await Document.findOne({
=======
    const update = await Document.update(req.body, {
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

<<<<<<< HEAD
    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }

    let fileUrl = existingDocument.url;
    let jenis = existingDocument.jenis;
    let oldFileId = extractFileId(existingDocument.url);

    // Ketika update dengan unggahan file baru
    if (req.file) {
      if (!oldFileId) {
        return res.status(400).json({
          success: false,
          message: "File ID tidak ditemukan dalam URL dokumen lama",
        });
      }
    }

    // Upload file baru
    const newFile = await drive.files.update({
      requestBody: {
        name: req.file.originalname,
      },
      fileId: oldFileId,
      media: {
        mimeType: req.file.mimetype,
        body: Readable.from(req.file.buffer),
      },
      fields: "id",
    });

    const newFileId = newFile.data.id;

    fileUrl = `https://drive.google.com/uc?id=${newFileId}/view`;
    jenis = req.file.mimetype;

    await Document.update(
      {
        ...req.body,
        url: fileUrl,
        jenis,
        tanggalUpdate: new Date().toISOString().split("T")[0],
      },
      {
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      }
    );

    const updatedDocument = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui",
      data: updatedDocument,
=======
    if (update[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan atau tidak ada perubahan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui",
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
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
<<<<<<< HEAD
    const existingDocument = await Document.findOne({
=======
    const deleted = await Document.destroy({
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

<<<<<<< HEAD
    if (!existingDocument) {
=======
    if (deleted === 0) {
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan atau sudah terhapus",
      });
    }
<<<<<<< HEAD

    const fileId = extractFileId(existingDocument.url);

    try {
      if (fileId) {
        await drive.files.delete({
          fileId: fileId,
        });
      }
    } catch (error) {
      console.warn(
        "File tidak berhasil dihapus dari Google Drive",
        error.message
      );
    }

    await Document.destroy({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

=======
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
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
<<<<<<< HEAD
          { nomor: { [Op.like]: `%${query}%` } },
=======
>>>>>>> 71e1219 (Add Endpoint CRUD & Search Document)
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
