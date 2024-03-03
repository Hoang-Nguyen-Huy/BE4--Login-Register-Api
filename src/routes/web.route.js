var router = require('express').Router();
const login = require('../controllers/login.controller');
const register = require('../controllers/register.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports = app => {
    // router.get('/auth/profile', authMiddleware.loggedin, (req, res) => {
    //     res.status(200).json({ message : 'hello' });
    // });

    router.get('/auth/profile', authMiddleware.loggedin, (req, res) => {
        console.log(req.session.user);
        if (req.session.loggedin) {
            const { userid, username } = req.session.user; // Lấy id và username từ session
            return res.status(200).json({ userid, username });
        } else {
            return res.status(401).json({ message: 'You are not logged in!' });
        }
    });
    
    app.use(router);
}