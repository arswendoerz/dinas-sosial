import Document from "../model/document.model.js";
import User from "../model/user.model.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";

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
  const regexList = [/id=([^&/]+)/, /\/d\/([a-zA-Z0-9_-]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
}

// Reusable helper to get userIds with same role
const getUserIdsByRole = async (role) => {
  const users = await User.findAll({
    where: { role },
    attributes: ["id"],
  });
  return users.map((user) => user.id);
};

export const createDocument = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File dokumen wajib diunggah!",
      });
    }

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
      media,
      fields: "id",
    });

    const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view`;

    const document = await Document.create({
      nomor,
      nama,
      perihal,
      kategori,
      jenis: req.file.mimetype,
      url: fileUrl,
      userId: req.user.userId,
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
    const userIds = await getUserIdsByRole(req.user.role);
    if (userIds.length === 0)
      return res.status(200).json({ success: true, data: [] });

    const documents = await Document.findAll({
      where: { userId: { [Op.in]: userIds } },
      include: { model: User, attributes: ["id", "email", "role"] },
    });

    res.status(200).json({ success: true, data: documents });
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
    const userIds = await getUserIdsByRole(req.user.role);

    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }

    res.status(200).json({ success: true, data: document });
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
    const userIds = await getUserIdsByRole(req.user.role);

    const existingDocument = await Document.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }

    let fileUrl = existingDocument.url;
    let jenis = existingDocument.jenis;
    const oldFileId = extractFileId(fileUrl);

    if (req.file) {
      if (!oldFileId) {
        return res.status(400).json({
          success: false,
          message: "File ID tidak ditemukan dalam URL dokumen lama",
        });
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
          userId: { [Op.in]: userIds },
        },
      }
    );

    const updatedDocument = await Document.findOne({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui",
      data: updatedDocument,
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
    const userIds = await getUserIdsByRole(req.user.role);

    const existingDocument = await Document.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan atau sudah terhapus",
      });
    }

    const fileId = extractFileId(existingDocument.url);

    try {
      if (fileId) {
        await drive.files.delete({ fileId });
      }
    } catch (error) {
      console.warn(
        "File tidak berhasil dihapus dari Google Drive:",
        error.message
      );
    }

    await Document.destroy({ where: { id: req.params.id } });

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

    const userIds = await getUserIdsByRole(req.user.role);

    const documents = await Document.findAll({
      where: {
        userId: { [Op.in]: userIds },
        [Op.or]: [
          { nama: { [Op.like]: `%${query}%` } },
          { nomor: { [Op.like]: `%${query}%` } },
          { perihal: { [Op.like]: `%${query}%` } },
          { kategori: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    console.error("Gagal mencari dokumen:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari dokumen",
    });
  }
};
