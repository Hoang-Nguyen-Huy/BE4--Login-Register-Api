const multer = require('multer');
const fs = require('fs');
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

exports.upFile = async (req, res, next) => {
    const file = req.file;
    console.log(file);
}