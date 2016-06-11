var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var program = require('commander');

program
  .option('-e --extIP <extIP>', 'External IP to listen on', String, 'localhost')
  .option('-d --dbIP <dbIP>', 'IP address of mongodb server', String, 'mongodb://localhost:27017')
  .option('-p --port <port>', 'Port to listen on', Number, process.env.PORT || 8080);
program.parse(process.argv);


var mongo = require('mongodb');
mongo.connect(program.dbIP, startListening);

var db = null;
var usersCollection = null;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

function startListening(err, db) {
  if (err) {
    // Print error to console
    return console.dir(err);
  } else {
    // Assign db to what we get
    this.db = db;
    db.createCollection('users', function (err, collection) {
      if (!err) {
        console.log("Created collection usersCollection!");

        usersCollection = collection;
        require('./routes.js')(app, usersCollection);

        app.listen(program.port, program.extIP);
        console.log("The good stuff lives on port: " + program.port);
      } else {
        console.log("Error in creating usersCollection collection");
      }
    });
  }
}
