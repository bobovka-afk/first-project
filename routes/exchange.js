const express = require('express');
const router = express.Router();
const { getData } = require('../services/currencyService');

router.get('/', (req, res) => { 
    try { 
        const { source, target, amount } = req.query;

        if (!source || !target || !amount) {
            return res.status(400).json({ error: 'Не переданы все параметры (source, target, amount).' });
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber)) {
            return res.status(400).json({ error: 'Параметр amount должен быть числом.' });
        }

        const data = getData();
        const sourceRate = data.data?.[source]?.value;
        const targetRate = data.data?.[target]?.value;

        if (!sourceRate || !targetRate) {
            return res.status(404).json({ error: 'Не найден курс для переданных валют.' });
        }

        const result = (amountNumber * targetRate) / sourceRate;
        const roundedNumber = Math.round(result * 100) / 100; // Округление до 2 знаков после ,
        const dateOnly = data.meta?.last_updated_at?.split("T")[0] || 'Дата недоступна';

        return res.json({
            source,
            target,
            amount: amountNumber,
            convertedAmount: roundedNumber,
            date: dateOnly
        });

    } catch (error) { 
        console.error(error);
        return res.status(500).json({ error: 'Ошибка при обработке запроса на обмен валют.' });
    }
});

module.exports = router;
