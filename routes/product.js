const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories,
} = require('../controllers/product');

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

router.get('/product/categories', getAllUniqueCategories);

module.exports = router;
