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

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Prices.destroy({where: {id: id}});
    res.json(id);
});

module.exports = router;