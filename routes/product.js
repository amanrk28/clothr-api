const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isSignedIn } = require('../controllers/auth');
const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
} = require('../controllers/product');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// Params
router.param('userId', getUserById);
router.param('productId', getProductById);

// Routes
router.post(
    '/product/create/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);
router.get('/products', getAllProducts);

router.put(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);

router.delete(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
);

module.exports = router;
