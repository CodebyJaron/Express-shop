const express = require('express');
const router = express.Router();

const Product = require('../backend/models/product');

router.get('/', async (req, res) => {
    res.render('products/list', {
        products: await Product.getAll(),
    });
});
module.exports = router;
