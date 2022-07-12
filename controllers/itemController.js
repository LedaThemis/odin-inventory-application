const async = require('async');
const { body, validationResult, check } = require('express-validator');

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
      content: 'item/form',
      props: { categories, item: undefined, errors: undefined },
    });
  });
};

const item_validators = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
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
];

exports.item_create_post = [
  ...item_validators,
  body('name').custom(async (name) => {
    return Item.findOne({ name }).then((foundItem) => {
      if (foundItem) {
        return Promise.reject('Item is already available');
      } else {
        return Promise.resolve();
      }
    });
  }),

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
          content: 'item/form',
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
  Item.findById(req.params.id).exec((err, item) => {
    res.render('index', { title: 'Delete Item', content: 'item/delete', props: { item } });
  });
};

exports.item_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      categories: (callback) => {
        Category.find().exec(callback);
      },
      currentItem: (callback) => {
        Item.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      const { categories, currentItem } = results;

      res.render('index', {
        title: 'Update Item',
        content: 'item/form',
        props: { categories, item: currentItem, errors: undefined },
      });
    }
  );
};

exports.item_update_post = [
  ...item_validators,

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    const fields = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
    };

    const item = new Item(fields);

    if (!errors.isEmpty()) {
      Category.find().exec((err, categories) => {
        if (err) next(err);

        res.render('index', {
          title: 'Update Item',
          content: 'item/form',
          props: { categories, item, errors: errors.errors },
        });
      });
    } else {
      Item.findOne({ name: req.body.name }).exec((err, foundItem) => {
        if (err) next(err);

        if (foundItem && `${foundItem._id}` !== `${req.params.id}`) {
          Category.find().exec((err, categories) => {
            if (err) next(err);

            res.render('index', {
              title: 'Update Item',
              content: 'item/form',
              props: { categories, item, errors: [{ msg: 'An item with this name is already available' }] },
            });
          });
        } else {
          Item.findByIdAndUpdate(req.params.id, fields, {}, (err, updatedItem) => {
            if (err) next(err);

            res.redirect(updatedItem.url);
          });
        }
      });
    }
  },
];
