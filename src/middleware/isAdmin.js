const adminMiddleware = (req, res, next) => {
    if (req.isAuthenticated() && req.user.permission === 2) {
        return next();
    } else res.redirect('/');
};

module.exports = adminMiddleware;
