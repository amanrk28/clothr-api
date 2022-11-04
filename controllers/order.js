const Product = require('../models/product');
const { Order, ProductCart } = require('../models/order');

const getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: 'Order not found in DB',
                });
            }
            req.order = order;
            next();
        });
};

const createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to save order in DB',
            });
        }
        res.json(order);
    });
};

const getAllOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name')
        .exec((err, items) => {
            if (err) {
                return res.status(400).json({
                    error: 'No orders found in DB',
                });
            }
            res.json(items);
        });
};

const getOrderStatus = (req, res) => {
    return res.json(Order.schema.path('status').enumValues);
};

const updateOrderStatus = (req, res) => {
    Order.updateOne(
        { _id: req.body.order._id },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: 'Cannot update order status in DB',
                });
            }
            res.json(order);
        }
    );
};

module.exports = {
    getOrderById,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateOrderStatus,
};
