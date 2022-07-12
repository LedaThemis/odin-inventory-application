const Item = require('../models/item');

exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec((err, item) => {
      if (err) next(err);

      res.render('index', { title: `${item.name}`, content: 'item/detail', props: { item } });
    });
};

exports.item_create_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

exports.item_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED');
};

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
