const express = require('express');
const app = express();

const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./pages/auth');
const homeRoutes = require('./pages/home');
const productsRoutes = require('./pages/products');
const cartRoutes = require('./pages/cart');
const adminRoutes = require('./pages/admin');
const categoryRoutes = require('./pages/category');

// middlewares
const isAdmin = require('./middleware/isAdmin');
const checkAuth = require('./middleware/checkAuth');

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(
    session({
        secret: '1234567',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.static('src/static/assets'));

app.use('/auth', authRoutes);

app.use('/', homeRoutes);
app.use('/products', productsRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', checkAuth, cartRoutes);
app.use('/admin', isAdmin, adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
