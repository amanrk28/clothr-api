const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { authMsg } = require('../messages/auth');

const signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(409).json({
            error: errors.array()[0].msg,
        });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.cookie('token', token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};

const signin = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: authMsg.userDoesnotExist });
        }
        if (!user.authenticate(password)) {
            return res
                .status(401)
                .json({ error: authMsg.emailAndPasswordDonotMatch });
        }
        // Create Token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // Insert token in cookie
        res.cookie('token', token, { expire: new Date() + 9999 });
        // Send response to FE
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};

const signout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: authMsg.signout });
};

// Protected Routes
const isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth',
});

module.exports = {
    signup,
    signout,
    signin,
    isSignedIn,
};
