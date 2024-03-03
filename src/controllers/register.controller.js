const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv/config');

exports.register = (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        User.findByUserName(username, (err, user) => {
            if (err || user) {
                res.json({ message : 'User credentials are exist' });
            }
        });
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashed) => {
            //Create a User
            const newUserData = {
                username: username, 
                password: hashed
            };
            User.create(newUserData, (err, user) => {
                if (!err) {
                    res.status(200).json({ message : 'Register successfully!'});
                }
            });
        });
    } else {
        res.json({ message: 'Please enter your information!!' });
    }
};