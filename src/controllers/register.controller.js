const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv/config');

exports.register = (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        // Check if the user exists
        User.findByUserName(username, (err, user) => {
            if (err) {
                console.error('Error finding user by username: ', err);
                return res.status(500).json({ message: 'Error finding user by username' });
            }
            if (user) {
                return res.status(400).json({ message: 'User credentials already exist' });
            }

            // Hash the password
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND), (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password: ', err);
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                // Create the user
                User.create({ username, password: hashedPassword }, (err, newUser) => {
                    if (err) {
                        console.error('Error creating user: ', err);
                        return res.status(500).json({ message: 'Error creating user' });
                    }

                    return res.status(200).json({ message: 'Register successfully!' });
                });
            });
        });
    } else {
        res.json({ message: 'Please enter your information!!' });
    }
};