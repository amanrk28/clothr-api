const express = require('express');
const router = express.Router();

const {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/category');
const { isAuthenticated, isSignedIn, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Params
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// Routes
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategory);

router.post(
    '/category/create/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);

router.put(
    '/category/:categoryId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

router.delete(
    '/category/:categoryId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteCategory
);

module.exports = router;
