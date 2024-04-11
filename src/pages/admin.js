const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

router.get('/', function (req, res) {
    res.render('admin/home', {});
});
module.exports = router;
