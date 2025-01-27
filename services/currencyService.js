const axios = require('axios');
const { API_URL, SECRET_KEY } = require('../config/config');

let data = {}; // Данные с API

async function fetchData() {
    try {
        const response = await axios.get(`${API_URL}${SECRET_KEY}`);
        data = response.data;
        console.log('Данные валют обновлены:', new Date().toLocaleString());
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Автообновление данных каждые 12 часов
setInterval(fetchData, 12 * 60 * 60 * 1000);
fetchData(); // Первый запуск

function getData() {
    return data;
}

module.exports = { fetchData, getData };
