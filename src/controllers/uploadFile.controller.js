const multer = require('multer');
const fs = require('fs');
const uploadFile = require('../models/file.model');
const uploadsFolder = "uploads";

exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }
        cb(null, uploadsFolder);
    },
    filename: function (req, file, cb) {
        const fileInfo = file.originalname.split(".");
        let filename = file.originalname;
        let filepath = `${uploadsFolder}/${filename}`;
        let i = 1;
        while (fs.existsSync(filepath)) {
            filename = fileInfo[0] + `(${i})` + (fileInfo.length > 1 ? "." + fileInfo[1] : "");
            filepath = `${uploadsFolder}/${filename}`;
            i++;
        }
        cb(null, filename);
    }
});

exports.upFile = async (req, res) => {
    const file = req.file;
    const createdLocalFile = {
        diskPath: file.path,
        fileName: file.filename
    };
    uploadFile.create(createdLocalFile, (err, newLocalFile) => {
        if (err) {
            console.error("Error creating local file: ", err);
            return res.status(400).json({ message: 'Error creating local file' });
        }
        const url = `${req.protocol}://${req.headers.host}/local-files/${newLocalFile.id}`;
        return res.status(201).json(url);
    });
}
