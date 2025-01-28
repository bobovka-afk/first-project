const express = require('express');
const { PORT } = require('./config/config');
const exchangeRoutes = require('./routes/exchange');
const currencyRoutes = require('./routes/currency');
const sequelize = require('./config/db'); 

const app = express();

sequelize.authenticate()
    .then(() => {
        console.log('База данных готова к работе');
    })
    .catch((err) => {
        console.error('Ошибка при подключении к БД:', err);
        process.exit(1); 
    });

app.use('/exchange-rate', exchangeRoutes);
app.use('/currency-list', currencyRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
