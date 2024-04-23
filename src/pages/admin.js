const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const Product = require('../backend/models/product');
const Order = require('../backend/models/orders');
const User = require('../backend/models/user');
const Category = require('../backend/models/category');

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
        products: await Product.getAll(),
    });
});

router.get('/products/create', isAdmin, async (req, res) => {
    res.render('admin/products/form', {
        user: req.user,
        categories: await Category.getAll(),
    });
});

// categories
router.get('/categories', isAdmin, async (req, res) => {
    res.render('admin/categories/list', {
        user: req.user,
        categories: await Category.getAll(),
    });
});

router.get('/categories/create', isAdmin, async (req, res) => {
    res.render('admin/categories/form', {
        user: req.user,
    });
});

router.get('/categories/edit/:id', isAdmin, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found');
        }
        console.log(category);

        res.render('admin/categories/form', {
            user: req.user,
            category: category,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
