const User = require('../models/user');
const Order = require('../models/order');
const { commonMsg } = require('../messages');

const getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: commonMsg.notFound('User'),
            });
        }
        req.profile = user;
        next();
    });
};

const getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};

const updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            return res.json(user);
        }
    );
};

const userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            return res.json(order);
        });
};

const pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id,
        });
    });
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases } },
        { new: true },
        err => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            next();
        }
    );
};

module.exports = {
    getUserById,
    getUser,
    updateUser,
    userPurchaseList,
    pushOrderInPurchaseList,
};
