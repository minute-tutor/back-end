// load the things we need
var mongoose = require('mongoose'); //standard mongodb stuff
var skillSchema = require('./skill');
var reviewSchema = require('./review');

// define the schema for our user models
var userSchema = mongoose.Schema({
  google: {
    id: String,
    email: String,
    name: String
  },
  description: String,
  money: Number,
  skills: [skillSchema],
  reviews: [reviewSchema],
  rate: Number,
  skypeID: String,
  lastLoggedIn: Number
}, {collection: 'users'});

// create the models for users and expose it to our app
module.exports = userSchema;
