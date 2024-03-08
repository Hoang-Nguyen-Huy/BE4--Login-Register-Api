var router = require('express').Router();
const login = require('../controllers/login.controller');
const register = require('../controllers/register.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

module.exports = app => {
    // router.get('/', authMiddleware.isAuth, login.login);
    router.post('/auth/login-with-username-and-password', login.login);

    router.get('/auth/login-with-google', login.loginWithGoogle);

    // router.get('/register', authMiddleware.isAuth, register.register);

    //[POST]: /accounts --> register --> create User and UserDetail
    router.post('/accounts', register.register)

    // router.get('/logout', authMiddleware.loggedin, login.logout);
    
    app.use(router);
}