const express = require('express');
const router = express.Router();

const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { isSignedIn } = require('../controllers/auth');
const { updateStock } = require('../controllers/product');
const {
    getOrderById,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateOrderStatus,
} = require('../controllers/order');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// Params
router.param('userId', getUserById);
router.param('orderId', getOrderById);

// Routes
router.post(
    '/order/create/:userId',
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

router.get(
    '/order/all/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders
);
router.get(
    '/order/status/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderStatus
);

router.put(
    '/order/:orderId/status/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateOrderStatus
);

module.exports = router;
