const express = require('express');
const router = express.Router();
const {Deposits} = require('../models');

router.get('/', async (req, res) => {
    const deposits = await Deposits.findAll();
    res.json(deposits);
});

router.get('/byCustomerId/:id', async (req, res) => {
    const id = req.params.id;
    const deposits = await Deposits.findAll({where: {id_customer: id}});
    res.json(deposits);
});

router.post('/', async (req, res) => {
    const deposit = req.body;
    await Deposits.create(deposit);
    res.json(deposit);
});


module.exports = router;