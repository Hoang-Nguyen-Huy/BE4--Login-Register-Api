var router = require('express').Router();
const uploadFile = require('../controllers/uploadFile.controller');
const multer = require('multer');
const upload = multer({ storage: uploadFile.storage });

module.exports = app => {
    // [POST]: /local-files/
    router.post('/local-files/', upload.single('file'), uploadFile.upFile);

    app.use(router);
}