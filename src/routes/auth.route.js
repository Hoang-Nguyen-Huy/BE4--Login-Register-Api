var router = require('express').Router();
const login = require('../controllers/login.controller');
const register = require('../controllers/register.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

module.exports = app => {
    // router.get('/', authMiddleware.isAuth, login.login);
    // router.get('/logout', authMiddleware.loggedin, login.logout);
    // router.get('/register', authMiddleware.isAuth, register.register);


    //[POST]: /auth/login-with-username-and-passowrd --> login 
    router.post('/auth/login-with-username-and-password', login.login);

    
    //[GET]: /auth/login-with-google --> loginWithGoogle
    router.get('/auth/login-with-google', login.loginWithGoogle);


    //[POST]: /accounts --> register --> create User and UserDetail
    router.post('/accounts', register.register)

    
    app.use(router);
}