const express = require('express');
const router = express.Router();
const {Prices} = require('../models');

router.get('/', async (req, res) => {
    const prices = await Prices.findAll();
    res.json(prices);
});

router.post('/', async (req, res) => {
    const price = req.body;
    await Prices.create(price);
    res.json(price);
});


module.exports = router;