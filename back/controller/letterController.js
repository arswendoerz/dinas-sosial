import Letter from "../model/letter.model.js";
import User from "../model/user.model.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { google } from "googleapis";
import { Readable } from "stream";

dotenv.config();

const oauth2client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2client });

function extractFileId(url) {
  const regexList = [/id=([^&/]+)/, /\/d\/([a-zA-Z0-9_-]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
}

const getUserIdsByRole = async (role) => {
  const users = await User.findAll({
    where: { role },
    attributes: ["id"],
  });
  return users.map((user) => user.id);
};

export const createLetter = async (req, res) => {
  try {
    const { nomor, nama, perihal, kategori } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File surat wajib diunggah!",
      });
    }

    const fileMeta = {
      name: req.file.originalname,
      parents: [process.env.DRIVE_FOLDER_ID_SURAT],
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

    const letter = await Letter.create({
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
      message: "Surat berhasil dibuat",
      data: letter,
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
    const userIds = await getUserIdsByRole(req.user.role);
    if (userIds.length === 0)
      return req.status(200).json({ success: true, data: [] });

    const letters = await Letter.findAll({
      where: { userId: { [Op.in]: userIds } },
      include: { model: User, attributes: ["id", "email", "role"] },
    });
    res.status(200).json({
      success: true,
      data: letters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil surat",
    });
  }
};

export const getLetterById = async (req, res) => {
  try {
    const userIds = await getUserIdsByRole(req.user.role);

    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Surat yang diminta tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      data: letter,
    });
  } catch (error) {
    console.error("Gagal mengambil surat:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan dalam mengambil surat",
    });
  }
};

export const updateLetter = async (req, res) => {
  try {
    const userIds = await getUserIdsByRole(req.user.role);

    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Surat yang diminta tidak ditemukan",
      });
    }

    let fileUrl = letter.url;
    let jenis = letter.jenis;
    let oldFileId = extractFileId(fileUrl);

    if (req.file) {
      if (!oldFileId) {
        return res.status(400).json({
          success: false,
          message: "File ID ditemukan dalam surat lama",
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

    await Letter.update(
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

    const updateLetter = await Letter.findOne({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Surat berhasil diperbarui",
      data: updateLetter,
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
    const userIds = await getUserIdsByRole(req.user.role);

    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: { [Op.in]: userIds },
      },
    });

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Surat yang diminta tidak ditemukan",
      });
    }

    const fileId = extractFileId(letter.url);

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

    await letter.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      success: true,
      message: "Surat berhasil dihapus",
    });
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

    const userIds = await getUserIdsByRole(req.user.role);

    const letters = await Letter.findAll({
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

    res.status(200).json({ success: true, data: letters });
  } catch (error) {
    console.error("Gagal mencari surat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari surat",
    });
  }
};
