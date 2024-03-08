const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv/config');

exports.register = async (req, res) => {
    const { username, password, role, detail } = req.body;
    if ((username && password && role && detail) || (username && password && detail)) {
        try {
            //Check if the username exists
            const existingUser = await User.findByUserName(username);
            if (existingUser) {
                return res.status(400).json({ message: 'User credentials already exists' });
            }

            //Hash the password
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));

            //Create the user
            const createdUser = {
                username: username, 
                password: hashedPassword, 
                role: role === undefined ? 1 : role,
                detail: detail
            };

            User.create(createdUser, (err, newUser) => {
                if (err) {
                    console.error("Error creating user: ", err);
                    return res.status(400).json({ message: 'Error creating user' });
                }
                const responseData = {
                    id: newUser.userid,
                    username: username, 
                    role: role === undefined ? 1 : role, 
                    detail: newUser.detail
                };
    
                return res.status(200).json(responseData);
            });
        } catch(error) {
            console.error("Error registering user: ", error);
            return res.status(400).json({ message: 'Error registering user' });
        }
    } else {
        res.json({ message: 'Please enter your information!!' });
    }
};