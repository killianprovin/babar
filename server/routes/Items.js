const express = require('express');
const router = express.Router();
const {Items, Customers} = require('../models');
const { where } = require('sequelize');

router.get('/', async (req, res) => {
    const items = await Items.findAll();
    res.json(items);
});

router.post('/', async (req, res) => {
    const item = req.body;
    await Items.create(item);
    res.json(item);
});


module.exports = router;