const express = require('express');
const router = express.Router();

const Product = require('../backend/models/product');
const isAdmin = require('../middleware/isAdmin');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    res.render('products/products', {
        products: await Product.getAll(),
        user: req.user ? req.user : null || null,
    });
});

router.post('/', isAdmin, upload.array('images'), async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;

        const images = req.files.map((file) => 'public/uploads/' + file.filename);

        const product = new Product(null, name, images, description, price, categoryId);
        await product.create();
        res.redirect(req.headers.referer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating product');
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, images, description, price, categoryId } = req.body;
        const product = new Product(id, name, images, description, price, categoryId);
        await product.update();
        res.redirect(req.headers.referer);
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const product = new Product(id);
        await product.delete();
        res.redirect(req.headers.referer);
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

module.exports = router;
