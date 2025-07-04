import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Users",
  }
);

export default User;
