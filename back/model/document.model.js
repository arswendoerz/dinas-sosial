import { DataTypes } from "sequelize";
import sequelize from "../db/db.js"; // atau koneksi sequelize-mu
import User from "./user.model.js";

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomor: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perihal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis: {
      type: DataTypes.STRING(255),
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalUpload: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tanggalUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Document, { foreignKey: "userId", onDelete: "CASCADE" });
Document.belongsTo(User, { foreignKey: "userId" });

export default Document;
