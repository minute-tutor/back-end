var mongoose = require('mongoose');

module.exports = function (app) {
  app.get('/getUserByID/*', function (req, res) { // /user/id/
    var url = req.url;
    var id = url.substr(url.lastIndexOf("/") + 1, url.length);
    console.log("id = " + id);
    var userSchema = require('./../models/user');
    var userModel = mongoose.model('userModel', userSchema);
    userModel.findOne({'google.id': id}, function (err, user) {
      res.setHeader('Content-Type', 'application/json');
      if (!err) {
        res.status(200).send(JSON.stringify({user: user}));
      } else {
        res.status(200).send(JSON.stringify({user: null}));
      }
    });
  });

  app.get('/findUsersBySkill/*', function (req, res) {
    var url = req.url;
    var skillInQuestion = url.substr(url.lastIndexOf("/") + 1, url.length);

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema);

    userModel.find({'skills.name': skillInQuestion}, function (err, data) {
      if (!err) {
        var stringified = JSON.stringify(data);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(stringified);
      } else {
        res.status(400).send();
      }
    });
  });

  app.post('/newuser/', function (req, res) {
    var gid = req.body.id;
    var gemail = req.body.email;
    var gname = req.body.name;

    var description = req.body.description;
    var money = 0;
    var skills = req.body.skills;
    var reviews = [];
    var rate = req.body.rate;
    var skypeid = req.body.skypeID;
    var lastLoggedIn = new Date().getTime();

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema)

    var newUser = new userModel();

    // set all of the relevant information
    newUser.google.id = gid;
    newUser.google.name = gname;
    newUser.google.email = gemail;
    newUser.description = description;
    newUser.money = money;
    newUser.reviews = reviews;
    newUser.rate = rate;
    newUser.skypeID = skypeid;
    newUser.lastLoggedIn = lastLoggedIn;

    newUser.save(function (err) {
      if (err) {
        throw err;
      } else {
        console.log("saved");
        userModel.findOne({'google.id': gid}, function (err, user) {
          if (!err) {
            var skillJSON = JSON.parse(skills);
            var skillSchema = require('../models/skill');
            var skillModel = mongoose.model('skillModel', skillSchema);
            for (var i in skillJSON) {
              var newSkill = new skillModel;
              newSkill.name = skillJSON[i].name;
              user.skills.push(newSkill);
              console.log("pushed new skill " + newSkill);
            }
            console.log("saving agagin");
            user.save();
            res.header('Access-Control-Allow-Origin: *');
            res.header('Access-Control-Allow-Origin', 'http://localhost:63342/');
            res.header('Access-Control-Allow-Origin', '*');
            // res.header('Access-Control-Allow-Origin', 'http://localhost:*');
            res.status(200).send();
          } else {
            res.status(400).send();
          }
        });
      }
    });
    console.log("done");
  });

  app.post('/addreview/', function (req, res) { // Add all teh reviewz
    var googleID = req.body.id;
    var review = req.body.review;

    var reviewSchema = require('../models/review');
    var reviewModel = mongoose.model('reviewModel', reviewSchema);

    var newReview = new reviewModel;
    newReview.stars = review;

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema);
    userModel.findOne({'google.id': googleID}, function (err, user) {
      if (!err && user != null) {
        user.reviews.push(newReview);
        user.save();
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    });
  });

  app.post('/updateLogin/', function (req, res) {
    var userID = req.body.id;
    var timestamp = req.body.timestamp;

    console.log("userID" + userID);
    console.log("timestamp" + timestamp);

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema);

    userModel.findOne({'google.id': userID}, function (err, user) {
      if (!err && user != null) {
        user.lastLoggedIn = timestamp;
        user.save();
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    })
  });

  app.post('/updateDescription/', function (req, res) {
    var userID = req.body.id;
    var description = req.body.description;

    updateUserField(userID, 'description', description) ? res.status(200).send() : res.status(500).send();
  });

  app.post('/updateRate/', function (req, res) {
    var userID = req.body.id;
    var newRate = req.body.rate;

    updateUserField(userID, 'rate', newRate) ? res.status(200).send() : res.status(500).send();
  });

  app.post('/updateSkypeID/', function (req, res) {
    var userID = req.body.id;
    var newSkype = req.body.skypeID;

    updateUserField(userID, 'rate', newSkype) ? res.status(200).send() : res.status(500).send();
  });
};

function updateUserField(id, field, value) {
  var userSchema = require('../models/user');
  var userModel = mongoose.model('userModel', userSchema);

  userModel.findOne({'google.id': id}, function (err, user) {
    if (!err && user != null) {
      user[field] = value;
      user.save();
      return true;
    } else {
      return false;
    }
  });
}
