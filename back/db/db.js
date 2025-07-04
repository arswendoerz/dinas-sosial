import { Sequelize } from "sequelize";

const sequelize = new Sequelize("tes_dinsos", "root", "", {
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql",
  logging: false, // Disable logging for cleaner output
});

export default sequelize;
