const express = require('express');
const router = express.Router();
const Category = require('../backend/models/category');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        const category = new Category(null, name);
        await category.create();
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating category');
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = new Category(id, name);
        await category.update();
        res.redirect(req.headers.referer);
    } catch (error) {
        res.status(500).send('Error updating category');
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const category = new Category(id);
        await category.delete();
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting category');
    }
});

module.exports = router;
