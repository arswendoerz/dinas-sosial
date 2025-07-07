import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Format email tidak valid",
        },
      },
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("perencanaan", "rehabilitasi sosial"),
      allowNull: false,
      defaultValue: "perencanaan",
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: true, // createdAt & updatedAt
  }
);

export default User;
