require('dotenv').config(); // Для загрузки значений из .env

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,  // 127.0.0.1
  port: process.env.DB_PORT,  // 3307
  user: process.env.DB_USER,  // sa
  password: process.env.DB_PASSWORD,  // Password2201
  database: process.env.DB_NAME  // db_currency
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
  } else {
    console.log('Подключение успешно установлено');
  }
});

module.exports = connection;