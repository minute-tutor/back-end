var mongoose = require('mongoose');

module.exports = function (app) {
  app.get('/getUserByToken/*', function (req, res) { // /user/token/
    var url = req.url;
    var token = url.substr(url.lastIndexOf("/") + 1, url.length);
    var user = require('./../models/user');
    user.findOne({'google.token': token}).exec(function (err, user) {
      res.setHeader('Content-Type', 'application/json');
      if (!err) {
        res.status(200).send(JSON.stringify({user: user}));
      } else {
        res.status(200).send(JSON.stringify({user: null}));
      }
    });
  });

  app.post('/newuser/', function (req, res) {
    var gid = req.body.id;
    var gtoken = req.body.token;
    var gemail = req.body.email;
    var gname = req.body.name;

    var money = 0;
    var skills = req.body.skills;
    var reviews = [];
    var rate = req.body.rate;
    var skypeid = req.body.skypeID;

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema)

    var newUser = new userModel();

    // set all of the relevant information
    newUser.google.id = gid;
    newUser.google.token = gtoken;
    newUser.google.name = gname;
    newUser.google.email = gemail; // pull the first email
    newUser.money = money;
    newUser.reviews = reviews;
    newUser.rate = rate;
    newUser.skypeID = skypeid;

    newUser.save(function (err) {
      if (err) {
        throw err;
      } else {
        userModel.findOne({'google.id': gid}, function (err, user) {
          if (!err) {
            var skillJSON = JSON.parse(skills);
            var skillSchema = require('../models/skill');
            var skillModel = mongoose.model('skillModel', skillSchema);
            for (var i in skillJSON) {
              var newSkill = new skillModel;
              newSkill.name = skillJSON[i].name;
              user.skills.push(newSkill);
            }
            user.save();
          }
        });
        res.status(200);
      }
    });
  });

  app.post('/addreview/', function (req, res) {
    var googleID = req.body.googleID;
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
      } else {
        throw err;
      }
    });
  });
};