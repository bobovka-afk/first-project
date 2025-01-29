const axios = require('axios');
const { API_URL, SECRET_KEY } = require('../config/config');
const connection = require('../db'); 
let data = {}; // Данные с API

// Функция для получения данных из API
async function fetchData() {
    try {
        const response = await axios.get(`${API_URL}${SECRET_KEY}`);
        data = response.data.data;  // Извлекаем объект с валютами из API
        console.log('Данные валют обновлены:', new Date().toLocaleString());

        // Вставка или обновление данных в базу данных
        await insertDataIntoDB(data);  // Вставляем или обновляем данные в базу
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Функция для преобразования даты из ISO 8601 в формат MySQL (YYYY-MM-DD HH:MM:SS)
function formatDateToMySQL(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19); // Преобразуем в нужный формат
    return formattedDate;
}

// Функция для вставки или обновления данных в базу данных
function insertDataIntoDB(data) {
    return new Promise((resolve, reject) => {
        // Преобразуем данные из API в формат для вставки
        const values = Object.keys(data).map(currencyCode => [
            currencyCode, // currency_code
            data[currencyCode].value, // rate
            formatDateToMySQL(new Date()) // Обновленную дату в правильном формате
        ]);

        // Пример запроса с ON DUPLICATE KEY UPDATE
        const query = `
            INSERT INTO exchange_rates (currency_code, rate, updated_at)
            VALUES ?
            ON DUPLICATE KEY UPDATE
                rate = VALUES(rate),
                updated_at = VALUES(updated_at);
        `;
        
        // Выполняем запрос
        connection.query(query, [values], (err, results) => {
            if (err) {
                console.error('Ошибка при вставке данных в базу данных:', err);
                reject(err); // Отправляем ошибку в reject
            } else {
                console.log('Данные успешно вставлены или обновлены:', results);
                resolve(results); // Отправляем результаты запроса в resolve
            }
        });
    });
}

// Функция для проверки актуальности данных в базе данных
async function checkAndUpdateRates() {
    try {
        const query = 'SELECT MAX(updated_at) as last_update FROM exchange_rates';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Ошибка при запросе даты обновления:', err);
                return;
            }

            const lastUpdate = results[0].last_update;
            if (lastUpdate) {
                const lastUpdateTime = new Date(lastUpdate).getTime();
                const currentTime = Date.now();
                const hoursDiff = (currentTime - lastUpdateTime) / (1000 * 60 * 60);

                if (hoursDiff < 12) {
                    console.log('Курсы валют актуальны, обновление не требуется.');
                    return;
                }
            }

            console.log('Курсы валют устарели, выполняем обновление...');
            fetchData(); // Обновляем данные из API
        });
    } catch (error) {
        console.error('Ошибка при проверке курсов:', error);
    }
}

// Запуск функции проверки и обновления курсов
checkAndUpdateRates();

// Автообновление данных каждые 12 часов
setInterval(fetchData, 12 * 60 * 60 * 1000); // Автообновление данных каждые 12 часов

// Первый запуск данных из API
fetchData();

function getData() {
    return data;
}

module.exports = { fetchData, getData, checkAndUpdateRates };
