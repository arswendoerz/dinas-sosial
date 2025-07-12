import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";

const Letter = sequelize.define(
  "Letter",
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

User.hasMany(Letter, { foreignKey: "userId", onDelete: "CASCADE" });
Letter.belongsTo(User, { foreignKey: "userId" });

export default Letter;
