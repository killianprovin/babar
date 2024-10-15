const express = require('express');
const router = express.Router();
const {Categories, Customers} = require('../models');
const { where } = require('sequelize');

router.get('/', async (req, res) => {
    const items = await Categories.findAll();
    res.json(items);
});

router.post('/', async (req, res) => {
    const item = req.body;
    await Categories.create(item);
    res.json(item);
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Categories.destroy({where: {id: id}});
    res.json(id);
});

module.exports = router;