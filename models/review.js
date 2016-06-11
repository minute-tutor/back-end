var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    min: [1, 'moar stars plz'],
    max: 5
  }
}, {collection: 'reviews'});

module.exports = mongoose.model('reviewModel', reviewSchema);