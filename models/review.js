var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  stars: Number
}, {collection: 'reviews'});

module.exports = reviewSchema;