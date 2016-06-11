var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  stars: number
}, {collection: 'reviews'});

module.exports = mongoose.model('reviewModel', reviewSchema);