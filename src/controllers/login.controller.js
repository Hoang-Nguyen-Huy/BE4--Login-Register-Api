const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        User.findByUserName(username, (err, user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found!!!' });
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result === true) {
                        req.session.loggedin = true;
                        req.session.user = user;
                        // res.status(200).json({ message: 'Login successfully' });
                        res.redirect('/auth/profile');
                    } else {
                        res.status(404).json({ message: 'Incorrect password' });
                    }
                });
            }
        });
    } else {
        res.status(404).json({ message: 'Login failed' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.status(404).json({ message: 'Logout failed' });
        res.status(200).json({ message: 'Bye' });
    });
};