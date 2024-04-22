const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const Product = require('../backend/models/product');
const Order = require('../backend/models/orders');
const User = require('../backend/models/user');

router.get('/', async function (req, res) {
    try {
        const orders = await Order.getAllInLast24Hours();
        const ordersWithUsernames = await Promise.all(
            orders.map(async (order) => {
                const username = await order.getUser().username;
                return { ...order, username };
            })
        );

        const products = await Product.getAll();

        const usersCreatedLast24Hours = await User.getAllCreatedLast24Hours();
        const totalIncomeLast24Hours = orders.reduce((total, order) => total + order.calculateOrderPrice(), 0);

        res.render('admin/home', {
            user: req.user,
            products: products,
            orders: ordersWithUsernames,
            usersCount: usersCreatedLast24Hours.length || 0,
            totalIncome: totalIncomeLast24Hours,
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/products', async function (req, res) {
    res.render('admin/products/list', {
        user: req.user,
        products: Product.getAll(),
    });
});

module.exports = router;
