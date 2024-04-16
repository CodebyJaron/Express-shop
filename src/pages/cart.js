const express = require('express');
const router = express.Router();

const Cart = require('../backend/models/cart');
const checkAuth = require('../middleware/checkAuth');

router.post('/:productId/add', checkAuth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { discordId } = req.user;

        let cart = await Cart.findByUserId(discordId);
        if (!cart) {
            cart = new Cart(null, discordId);
            await cart.create();
        }

        await cart.addProduct(productId);
        res.redirect('/cart');
    } catch (error) {
        res.status(500).send('Error adding product to cart');
    }
});

router.post('/:productId/remove', checkAuth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { discordId } = req.user;

        let cart = await Cart.findByUserId(discordId);
        if (!cart) {
            cart = new Cart(null, discordId);
            await cart.create();
        }

        await cart.removeProduct(productId);
        res.redirect('/cart');
    } catch (error) {
        res.status(500).send('Error removing product from cart');
    }
});

module.exports = router;
