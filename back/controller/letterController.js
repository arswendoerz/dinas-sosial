import Letter from "../model/letter.model.js";
import { Op } from " sequelize";
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
      media: media,
      fields: "id",
    });

    const fileId = file.data.id;
    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

    const letter = await Letter.create({
      jenis: req.file.mimetype,
      nomor,
      nama,
      perihal,
      kategori,
      url: fileUrl,
      userId: req.userId,
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
    const letters = await Letter.findAll({
      where: {
        userId: req.user.userId,
      },
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
    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
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
    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
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
    let oldFileId = extractFileId(letter.url);

    if (req.file) {
      if (!oldFileId) {
        return res.status(400).json({
          success: false,
          message: "File ID ditemukan dalam surat lama",
        });
      }

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

      fileUrl = `https://drive.google.com/file/d/${newFileId}/view`;
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
          userId: req.user.userId,
        },
      }
    );

    const updateLetter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
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
    const letter = await Letter.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
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
        await drive.files.delete({
          fileId: fileId,
        });
      }
    } catch (error) {
      console.warn(
        "File tidak berhasil dihapus dari Google Drive:",
        error.message
      );
    }

    await letter.destroy({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

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
