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

const category_validators = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
];

exports.category_create_post = [
  ...category_validators,
  body('name').custom(async (name) => {
    return Category.findOne({ name }).then((foundCategory) => {
      if (foundCategory) {
        return Promise.reject('Category is already available');
      } else {
        return Promise.resolve();
      }
    });
  }),

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
        title: `Delete Category`,
        content: 'category/delete',
        props: { ...results },
      });
    }
  );
};

exports.category_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) next(err);

    res.render('index', {
      title: 'Update Category',
      content: 'category/form',
      props: { category, errors: undefined },
    });
  });
};

exports.category_update_post = [
  ...category_validators,

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    const fields = {
      name: req.body.name,
      description: req.body.description,
    };

    const category = new Category(fields);

    if (!errors.isEmpty()) {
      res.render('index', {
        title: 'Update Category',
        content: 'category/form',
        props: { category, errors: errors.errors },
      });
    } else {
      Category.findOne({ name: req.body.name }).exec((err, foundCategory) => {
        if (err) next(err);

        if (foundCategory && `${foundCategory._id}` !== `${req.params.id}`) {
          res.render('index', {
            title: 'Update Category',
            content: 'category/form',
            props: { category, errors: [{ msg: 'A category with this name is already available' }] },
          });
        } else {
          Category.findByIdAndUpdate(req.params.id, fields, {}, (err, updatedCategory) => {
            if (err) next(err);

            res.redirect(updatedCategory.url);
          });
        }
      });
    }
  },
];
