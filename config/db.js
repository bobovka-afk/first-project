require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, 
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === "true", 
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true",
      },
    },
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Успешное подключение к SQL Server через Sequelize!");
  } catch (error) {
    console.error("❌ Ошибка подключения:", error);
  }
}

connectDB();

module.exports = sequelize;
