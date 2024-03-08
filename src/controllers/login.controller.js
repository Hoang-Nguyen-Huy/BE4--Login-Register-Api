const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv/config')

const { OAuth2Client } = require('google-auth-library');
const e = require('express');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const existingUser = await User.findByUserName(username);

        if (!existingUser) {
            res.status(404).json({ message: 'User not found!!!' });
        } else {
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if (result === true) {
                    //User authentication successful

                    //Create a JWT token with user information
                    const accessToken = jwt.sign({ id: existingUser.userid, username: existingUser.username }, process.env.JWT_SECRET);


                    req.session.loggedin = true;
                    req.session.user = existingUser;
                    // res.status(200).json({ message: 'Login successfully' });
                    // res.redirect('/auth/profile');
                    res.status(200).json({ accessToken });
                } else {
                    res.status(404).json({ message: 'Incorrect password' });
                }
            });
        }
    } else {
        res.status(404).json({ message: 'Login failed' });
    }
};

exports.loginWithGoogle = async (req, res) => {
    const { credential } = req.query;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: credential, 
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, given_name, family_name } = payload;

        //Check if the user exists in the database
        const existingUser = await User.findByUserName(email);

        if (!existingUser) {
            const newUser = {
                username: email,
                detail: {
                    lname: family_name,
                    fname: given_name,
                    email: email
                }
            };

            User.create(newUser, (err, createdUser) => {
                if (err) {
                    console.error("Error creating user: ", err);
                    return res.status(400).json({ message: 'Error creating user' });
                }
                // User created successfully
                // Generate access token and return it
                const accessToken = jwt.sign({ id: createdUser.userid, username: email }, process.env.JWT_SECRET);
                res.status(200).json({ accessToken });
            });
        } else {
            // User exists, generate access token and return it
            const accessToken = jwt.sign({ id: existingUser.userid, username: email }, process.env.JWT_SECRET);
            res.status(200).json({ accessToken });
        }
    }

    verify().catch(err => {
        console.error('Error verifying Google token: ', err);
        res.status(500).json({ message: 'Error verifying Google token' });
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.status(404).json({ message: 'Logout failed' });
        res.status(200).json({ message: 'Bye' });
    });
};