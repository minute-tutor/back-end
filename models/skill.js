var mongoose = require('mongoose');

// define the schema for our user models
var skillSchema = mongoose.Schema({
  name: string
  
}, {collection: 'skills'});

// create the models for users and expose it to our app
module.exports = mongoose.model('userModel', userSchema);
