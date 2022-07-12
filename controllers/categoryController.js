const async = require('async');

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
    content: 'category/create',
    props: { category: undefined, errors: undefined },
  });
};

exports.category_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

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
