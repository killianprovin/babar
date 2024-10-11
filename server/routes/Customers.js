const express = require('express');
const router = express.Router();
const {Customers, Deposits, Purchases, Items, Prices} = require('../models');


const lastPriceAtPurchaseDate = (prices, purchase) => {
    // Filtrer les prix par id_item et date <= purchase.createdAt
    const filteredPrices = prices.filter(price => 
        price.id_item === purchase.id_item && new Date(price.createdAt) <= new Date(purchase.createdAt)
    );

    // Trouver le prix le plus récent en utilisant reduce
    if (filteredPrices.length === 0) return 0;  // Si aucun prix n'est trouvé, retourner 0

    const latestPrice = filteredPrices.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    );

    return latestPrice.price;  // Retourner le prix trouvé
};


router.get('/', async (req, res) => {
    const customers = await Customers.findAll();
    res.json(customers);
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await Customers.findByPk(id);
    const items = await Items.findAll();
    const prices = await Prices.findAll();
    const deposits = await Deposits.findAll({where: {id_customer: id}});
    const purchases = await Purchases.findAll({where: {id_customer: id}});

    const fullpurchases = await Promise.all(purchases.map(async (purchase) => {
        const fullpurchase = {
            id: purchase.id,
            id_item: purchase.id_item,
            id_customer: purchase.id_customer,
            quantity: purchase.quantity,
            createdAt: purchase.createdAt,
            updatedAt: purchase.updatedAt,
            item: items.find(item => item.id === purchase.id_item).name || 'Unknown',
            price: lastPriceAtPurchaseDate(prices, purchase) * purchase.quantity
        };
        return fullpurchase;
    }));

    const fullCustomer = {
        id: customer.id,
        firstname: customer.firstname,
        lastname: customer.lastname,
        nickname: customer.nickname,
        year: customer.year,
        barman: customer.barman,
        status: customer.status,
        amount_invested: deposits.reduce((acc, deposit) => acc + deposit.amount, 0),
        allowed_overdraft: (deposits.reduce((acc, deposit) => acc + deposit.amount, 0) > 1000 ? -80 : (customer.barman ? -20 : 0)),
        balance: deposits.reduce((acc, deposit) => acc + deposit.amount, 0) - fullpurchases.reduce((acc, purchase) => acc + purchase.price * purchase.quantity, 0),
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,

        deposits: deposits.reverse(),

        purchases: fullpurchases.reverse(),
    };

    res.json(fullCustomer);
});

router.post('/', async (req, res) => {
    const customer = req.body;
    await Customers.create(customer);
    res.json(customer);
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Customers.destroy({where: {id: id}});
    res.json(id);
});

module.exports = router;