const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Запрос на регистрацию получен с email:', email);

    if (!email || !password) {
      console.log('Не все поля заполнены');
      return res.status(400).json({ error: 'Требуется заполнить все поля' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Проверка на символы email
    if (!emailRegex.test(email)) {
      console.log('Некорректный email:', email);
      return res.status(400).json({ error: 'Некорректный email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Пароль успешно захеширован:', hashedPassword);

    db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Ошибка при вставке данных:', err.stack);
          return res.status(500).json({ error: 'Ошибка при сохранении данных в базу данных' });
        }

        console.log('Пользователь успешно зарегистрирован:', email);
        res.json({
          message: 'Данные приняты и сохранены в базе данных!'
        });
      }
    );
  } catch (err) {
    console.error('Ошибка при обработке запроса на регистрацию:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Запрос на вход получен с email:', email);

    if (!email || !password) {
      console.log('Не все поля заполнены');
      return res.status(400).json({ error: 'Требуется заполнить все поля' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Проверка на символы email
    if (!emailRegex.test(email)) {
      console.log('Некорректный email:', email);
      return res.status(400).json({ error: 'Некорректный email' });
    }

    db.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Ошибка при поиске пользователя:', err.stack);
        return res.status(500).json({ error: 'Ошибка при поиске пользователя в базе данных' });
      }

      if (results.length === 0) {
        console.log('Пользователь не найден:', email);
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const storedHashedPassword = results[0].password;
      console.log('Пользователь найден, проверка пароля');

      const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

      if (isPasswordValid) {
        console.log('Пароль верный, авторизация успешна');
        return res.json({ message: 'Авторизация успешна!' });
      } else {
        console.log('Неверный пароль для пользователя:', email);
        return res.status(401).json({ error: 'Неверный пароль' });
      }
    });
  } catch (err) {
    console.error('Ошибка при обработке запроса на авторизацию:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
