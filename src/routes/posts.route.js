var router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middlewares');
const Posts = require('../controllers/posts.controller');

module.exports = app => {
    //[POST]: /posts/
    router.post('/posts/', authMiddleware.authenticateJWT, Posts.post);

    app.use(router);
}