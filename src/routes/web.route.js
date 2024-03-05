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

    router.get('/auth/profile', authMiddleware.authenticateJWT, (req, res) => {
        // console.log(req.headers);
        const { userid, username } = req.user;
        res.status(200).json({ id: userid, username });
    });
    
    app.use(router);
}