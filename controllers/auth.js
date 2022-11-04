const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: 'NOT able to save user in DB',
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
            return res.status(400).json({ error: 'User does not exist' });
        }
        if (!user.authenticate(password)) {
            return res
                .status(401)
                .json({ error: 'Email and password do not match' });
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
    res.json({
        message: 'User signout successfully',
    });
};

// Protected Routes
const isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth',
});

// Custom Middleware
const isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: 'ACCESS DENIED',
        });
    }
    next();
};
const isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'You are not ADMIN',
        });
    }
    next();
};

module.exports = {
    signup,
    signout,
    signin,
    isSignedIn,
    isAdmin,
    isAuthenticated,
};
