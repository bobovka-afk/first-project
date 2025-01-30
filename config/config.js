require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 4200,
    SECRET_KEY: process.env.SECRET_KEY,
    API_URL: 'https://api.currencyapi.com/v3/latest?apikey='
};