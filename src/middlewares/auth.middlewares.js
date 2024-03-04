const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.json({ message: 'Login failed' });
    }
};

exports.isAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        res.json({ message: 'Login successfully '});
    } else {
        next();
    }
};

exports.authenticateJWT = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                User.findByUserId(decoded.id, (err, user) => {
                    if (err || !user) {
                        res.status(401).json({ message: 'Unauthorized' });
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};