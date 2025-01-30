const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Подключение к базе данных

router.get('/', async (req, res) => { 
    try { 
        const { source, target, amount } = req.query;

        if (!source || !target || !amount) {
            return res.status(400).json({ error: 'Не переданы все параметры (source, target, amount).' });
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber)) {
            return res.status(400).json({ error: 'Параметр amount должен быть числом.' });
        }

        // Запрос курсов валют из базы данных
        const query = 'SELECT currency_code, rate, updated_at FROM exchange_rates WHERE currency_code IN (?, ?)';
        connection.query(query, [source, target], (err, results) => {
            if (err) {
                console.error('Ошибка при получении данных из базы:', err);
                return res.status(500).json({ error: 'Ошибка сервера при запросе к базе данных.' });
            }

            if (results.length < 2) {
                return res.status(404).json({ error: 'Не найден курс для переданных валют.' });
            }

            console.log('Курсы валют взяты из базы данных:', results); // Логируем полученные данные

            // Извлекаем курсы валют
            const rates = {};
            results.forEach(row => {
                rates[row.currency_code] = row.rate;
            });

            const sourceRate = rates[source];
            const targetRate = rates[target];

            if (!sourceRate || !targetRate) {
                return res.status(404).json({ error: 'Не найден курс для переданных валют.' });
            }

            // Выполняем расчет
            const result = (amountNumber * targetRate) / sourceRate;
            const roundedNumber = Math.round(result * 100) / 100; // Округление до 2 знаков после запятой

            // Получаем дату обновления курса (берем самую последнюю)
            const lastUpdated = results[0].updated_at.toISOString().split('T')[0];

            return res.json({
                source,
                target,
                amount: amountNumber,
                convertedAmount: roundedNumber,
                date: lastUpdated
            });
        });

    } catch (error) { 
        console.error(error);
        return res.status(500).json({ error: 'Ошибка при обработке запроса на обмен валют.' });
    }
});

module.exports = router;
