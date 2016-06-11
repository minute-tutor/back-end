var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var program = require('commander');

// Commander command line flags
program
  .option('-e --extIP <extIP>', 'External IP to listen on', String, 'localhost')
  .option('-d --dbIP <dbIP>', 'IP address of mongodb server', String, 'mongodb://localhost:27017')
  .option('-p --port <port>', 'Port to listen on', Number, process.env.PORT || 8080);
program.parse(process.argv);

// Express
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect(program.dbIP);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose Connection error:'));
db.once('open', function () {
  console.log("Connection to DB successful!");
  require('./routes')(app);
  app.listen(program.port, program.extIP); // listen for connections
  console.log("Listening on port     " + program.port);
});
