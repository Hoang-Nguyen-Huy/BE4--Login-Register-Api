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
                User.findUserDetailByID(decoded.id, (err, user) => {
                    if (err || !user) {
                        res.status(401).json({ message: 'Unauthorized' });
                    } else {
                        req.user = user;  // user include {user, userDetail}
                        next();
                    }
                });
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

exports.authorization = (req, res, next) => {
    const user = req.user.user;
    if(user.role === 0) {
        console.log(user);
        next();
    } else {
        // console.log(user);
        res.status(401).json({ message: 'Unauthorized' });
    }
};