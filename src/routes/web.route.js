var router = require('express').Router();
const login = require('../controllers/login.controller');
const register = require('../controllers/register.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

module.exports = app => {
    router.get('/profile', authMiddleware.loggedin, (req, res) => {
        res.status(200).json({ message : 'hello' });
    });
    
    app.use(router);
}