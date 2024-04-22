const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        user: req.user ? req.user : null || null,
    });
});

module.exports = router;
