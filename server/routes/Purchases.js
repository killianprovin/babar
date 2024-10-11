const express = require('express');
const router = express.Router();
const {Purchases} = require('../models');

router.get('/', async (req, res) => {
    const purchases = await Purchases.findAll();
    res.json(purchases);
});

router.get('/byCustomerId/:id', async (req, res) => {
    const id = req.params.id;
    const purchases = await Purchases.findAll({where: {id_customer: id}});
    res.json(purchases);
});

router.post('/', async (req, res) => {
    const purchase = req.body;
    await Purchases.create(purchase);
    res.json(purchase);
});


module.exports = router;