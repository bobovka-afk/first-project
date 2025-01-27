const express = require('express');
const { PORT } = require('./config/config');
const exchangeRoutes = require('./routes/exchange');
const currencyRoutes = require('./routes/currency');

const app = express();

app.use('/exchange-rate', exchangeRoutes);
app.use('/currency-list', currencyRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
