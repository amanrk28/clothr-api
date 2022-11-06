const express = require('express');
const router = express.Router();

const {
    getUserById,
    getUser,
    updateUser,
    userPurchaseList,
} = require('../controllers/user');
const { isSignedIn } = require('../controllers/auth');
const { isAuthenticated } = require('../middlewares/auth');

router.param('userId', getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.get(
    '/orders/user/:userId',
    isSignedIn,
    isAuthenticated,
    userPurchaseList
);

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

module.exports = router;
