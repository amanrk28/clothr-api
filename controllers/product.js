const Product = require('../models/product');
const formidable = require('formidable');
const lodash = require('lodash');
const fs = require('fs');

const getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate('cateogry')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Product not found in DB',
                });
            }
            req.product = product;
            next();
        });
};

const getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};
// Image delivery Middleware
const photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

const getMissingFields = (name, description, price, category, stock) => {
    let missingFields = [];
    if (!name) missingFields.push('name');
    if (!description) missingFields.push('description');
    if (!price) missingFields.push('price');
    if (!category) missingFields.push('category');
    if (!stock) missingFields.push('stock');
    return missingFields.toString(' ');
};

const createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'Problem with image',
            });
        }

        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: `Please include all fields ${getMissingFields(
                    name,
                    description,
                    price,
                    category,
                    stock
                )}`,
            });
        }

        let product = new Product(fields);

        // Handle File
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'File size is too big',
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: 'Saving product in DB FAILED',
                });
            }
            res.json(product);
        });
    });
};

const updateProduct = (req, res) => {
    let { product } = req;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: `Problem with image ${err}`,
            });
        }

        product = lodash.extend(product, fields);

        // Handle File
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'File size is too big',
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: 'Updating product in DB FAILED',
                });
            }
            res.json(product);
        });
    });
};

const deleteProduct = (req, res) => {
    const { product } = req;

    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to remove product',
            });
        }
        res.json({
            message: 'Successfully deleted product',
            deletedProduct,
        });
    });
};

const getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    let sortBy = req.query.sortBy || '_id';
    Product.find()
        .select('-photo')
        // .populate("category")
        .sort([[sortBy, 'asc']])
        .limit(limit)
        .exec((err, items) => {
            if (err) {
                return res.status(400).json({
                    error: 'No products found',
                });
            }
            res.json(items);
        });
};

const getAllUniqueCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            res.status(400).json({
                error: 'No category found',
            });
        }
        res.json(categories);
    });
};

const updateStock = (req, res, next) => {
    let ops = req.body.order.products.map(prod => ({
        updateOne: {
            filter: { _id: prod._id },
            update: { $inc: { stock: -prod.count, sold: +prod.count } },
        },
    }));
    Product.bulkWrite(ops, {}, err => {
        if (err) {
            res.status(400).json({
                error: 'Bulk Operation FAILED',
            });
        }
        next();
    });
};

module.exports = {
    getProductById,
    createProduct,
    deleteProduct,
    getProduct,
    photo,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories,
    updateStock,
};
