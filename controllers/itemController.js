const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');

exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec((err, item) => {
      if (err) next(err);

      res.render('index', { title: `${item.name}`, content: 'item/detail', props: { item } });
    });
};

exports.item_create_get = function (req, res, next) {
  Category.find().exec((err, categories) => {
    if (err) next(err);

    res.render('index', {
      title: 'Create Item',
      content: 'item/create',
      props: { categories, item: undefined, errors: undefined, lastSelectedCategoryID: undefined },
    });
  });
};

exports.item_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.')
    .custom(async (name) => {
      return Item.find({ name }).then((results) => {
        if (results.length === 0) {
          return Promise.resolve();
        } else {
          return Promise.reject('Item is already available');
        }
      });
    })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Price must be a positive integer')
    .escape(),
  body('numberInStock', 'Number of killograms in stock must not be empty.')
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Number of killograms in stock must be at least zero')
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must be selected.')
    .custom(async (categoryID) => {
      return Category.findById(categoryID).then((category) => {
        if (category) {
          return Promise.resolve();
        } else {
          return Promise.reject("Category doesn't exist");
        }
      });
    })
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
    });

    if (!errors.isEmpty()) {
      Category.find().exec((err, categories) => {
        if (err) next(err);

        res.render('index', {
          title: 'Create Item',
          content: 'item/create',
          props: { categories, item, errors: errors.errors },
        });
      });
    } else {
      item.save((err) => {
        if (err) next(err);

        res.redirect(item.url);
      });
    }
  },
];

exports.item_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.item_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.item_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.item_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};
