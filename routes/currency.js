const express = require('express');
const router = express.Router();

router.get('/', (_, res) => { 
    return res.json({
        message: "Популярные валюты для обмена",
        currencies: [
            { name: "Доллар США", code: "USD" },
            { name: "Евро", code: "EUR" },
            { name: "Фунт стерлингов", code: "GBP" },
            { name: "Швейцарский франк", code: "CHF" },
            { name: "Японская иена", code: "JPY" },
            { name: "Российский рубль", code: "RUB" }
        ]
    });
});

module.exports = router;
