var router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middlewares');
const Posts = require('../controllers/posts.controller');

module.exports = app => {
    //[POST]: /posts/
    router.post('/posts/', authMiddleware.authenticateJWT, Posts.post);

    //[PUT]: /posts/{id}
    router.put('/posts/:id', Posts.update);

    //[GET]: /posts/
    router.get('/posts/', authMiddleware.authenticateJWT, Posts.getAll);

    app.use(router);
}