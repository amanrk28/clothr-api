const Category = require('../models/category');

const getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                error: 'Category not found in DB',
            });
        }
        req.category = cate;
        next();
    });
};

const createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'NOT ABLE to save category in DB',
            });
        }
        res.json({ category });
    });
};

const getCategory = (req, res) => {
    return res.json(req.category);
};

const getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if (err) {
            return res.status(400).json({
                error: 'No categories found',
            });
        }
        res.json(items);
    });
};

const updateCategory = (req, res) => {
    const { category } = req;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to update category',
            });
        }
        res.json(updatedCategory);
    });
};

const deleteCategory = (req, res) => {
    const { category } = req;

    category.remove((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to remove category',
            });
        }
        res.json({
            message: 'Successfully deleted category',
            deletedCategory,
        });
    });
};

module.exports = {
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
};
