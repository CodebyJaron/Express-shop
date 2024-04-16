const express = require('express');
const router = express.Router();

const Product = require('../backend/models/product');
const isAdmin = require('../middleware/isAdmin');

router.get('/', async (req, res) => {
    res.render('products/list', {
        products: await Product.getAll(),
    });
});

router.get('/create', isAdmin, async (req, res) => {
    res.render('admin/products/create', {
        user: req.user,
    });
});

router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, images, description, price } = req.body;
        const product = new Product(null, name, images, description, price);
        await product.create();
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error creating product');
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, images, description, price } = req.body;
        const product = new Product(id, name, images, description, price);
        await product.update();
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const product = new Product(id);
        await product.delete();
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

module.exports = router;
