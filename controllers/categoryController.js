const async = require('async');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: (callback) => {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: (callback) => {
        Item.find({ category: req.params.id }, 'name').exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      res.render('index', {
        title: `${results.category.name} Category`,
        content: 'category/detail',
        props: { ...results },
      });
    }
  );
};

exports.category_create_get = function (req, res, next) {
  res.render('index', {
    title: 'Create Category',
    content: 'category/form',
    props: { category: undefined, errors: undefined },
  });
};

exports.category_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.')
    .custom(async (name) => {
      return Category.find({ name }).then((results) => {
        if (results.length === 0) {
          return Promise.resolve();
        } else {
          return Promise.reject('Category is already available');
        }
      });
    })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render('index', {
        title: 'Create Category',
        content: 'category/form',
        props: { category, errors: errors.errors },
      });
    } else {
      category.save((err) => {
        if (err) next(err);

        res.redirect(category.url);
      });
    }
  },
];
exports.category_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.category_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.category_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.category_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};
