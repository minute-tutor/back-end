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

  app.post('/newuser/', function (req, res) {
    var gid = req.body.id;
    var gemail = req.body.email;
    var gname = req.body.name;

    var money = 0;
    var skills = req.body.skills;
    var reviews = [];
    var rate = req.body.rate;
    var skypeid = req.body.skypeID;

    console.log("id = " + gid);
    console.log("email = " + gemail);
    console.log("name = " + gname);
    console.log("money = " + money);
    console.log("skills = " + skills);
    console.log("reviews = " + reviews);
    console.log("rate = " + rate);
    console.log("skypeid = " + skypeid);

    var userSchema = require('../models/user');
    var userModel = mongoose.model('userModel', userSchema)

    var newUser = new userModel();

    // set all of the relevant information
    newUser.google.id = gid;
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
            res.status(200).send();
          } else {
            res.status(400).send();
          }
        });
      }
    });
    console.log("done");
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
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    });
  });
};
