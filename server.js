const express = require('express');
const { PORT } = require('./config/config');
const exchangeRoutes = require('./routes/exchange');
const currencyRoutes = require('./routes/currency');
const { checkAndUpdateRates } = require('./currencyService');

const app = express();

app.use('/exchange-rate', exchangeRoutes);
app.use('/currency-list', currencyRoutes);

checkAndUpdateRates()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Ошибка при проверке курса валют:', err);
        process.exit(1);
    });
