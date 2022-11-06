const { authMsg } = require('../messages/auth');
const { commonMsg } = require('../messages/index');
const User = require('../models/user');
const { check } = require('express-validator');

// Custom Middleware
const isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: commonMsg.accessDenied,
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

const checkIfEmailInUse = value => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: value }, (err, user) => {
            if (err) {
                reject(new Error(commonMsg));
            }
            if (Boolean(user)) {
                reject(new Error(authMsg.emailAlreadyInUse));
            }
            resolve(true);
        });
    });
};

const validateSignupBody = [
    check('name', authMsg.threeChar('name')).trim().isLength({ min: 3 }),
    check('email', authMsg.isRequired('email'))
        .trim()
        .isEmail()
        .normalizeEmail()
        .custom(checkIfEmailInUse),
    check('password', authMsg.threeChar('password')).isLength({ min: 3 }),
];

const validateSigninBody = [
    check('email', authMsg.isRequired('email'))
        .trim()
        .isEmail()
        .normalizeEmail(),
    check('password', authMsg.isRequired('password')).isLength({ min: 3 }),
];

module.exports = {
    isAdmin,
    isAuthenticated,
    validateSignupBody,
    validateSigninBody,
};
