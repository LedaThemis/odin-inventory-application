#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

var async = require('async');
const Item = require('./models/item');
const Category = require('./models/category');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = [];
const categories = [];

/**
 * Creates a new item
 */
const itemCreate = (name, description, price, category, numberInStock, cb) => {
  const item = new Item({ name, description, price, category, numberInStock });

  item.save((err) => {
    if (err) {
      cb(err, null);
    } else {
      console.log('New item:', item);
      items.push(item);
      cb(null, item);
    }
  });
};
