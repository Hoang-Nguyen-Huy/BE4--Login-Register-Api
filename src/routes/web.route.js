var router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middlewares');
const User = require('../models/user.model');
const updateAccount = require('../controllers/updateAccount.controller');
const bcrypt = require('bcrypt');

module.exports = app => {
    // router.get('/auth/profile', authMiddleware.loggedin, (req, res) => {
    //     res.status(200).json({ message : 'hello' });
    // });

    router.get('/auth/profile', authMiddleware.authenticateJWT, (req, res) => {
        // console.log(req.headers);
        //req.user inclue {user, userDetail}
        // console.log(req.user);
        delete req.user.userDetail.userid;
        const userId = req.user.user.userid;
        const userName = req.user.user.username;
        const userRole = req.user.user.role;
        const userDetail = req.user.userDetail;
        res.status(200).json({ id: userId, username: userName, role: userRole, detail: userDetail });
    });

    router.put('/accounts/detail', updateAccount.update);
    
    app.use(router);
}