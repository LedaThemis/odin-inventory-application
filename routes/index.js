const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// ITEM ROUTES

// GET request to create Item
router.get('/item/create', item_controller.item_create_get);

// POST request to create Item
router.post('/item/create', item_controller.item_create_post);

// GET request to delete Item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete Item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update Item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update Item
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item
router.get('/item/:id', item_controller.item_detail);

// CATEGORY ROUTES

// GET request to create Category
router.get('/category/create', category_controller.category_create_get);

// POST request to create Category
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category
router.get('/category/:id', category_controller.category_detail);

module.exports = router;
