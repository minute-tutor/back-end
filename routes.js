module.exports = function (app) {
  app.get('/user/*', function (req, res) { // /user/token/
    var url = req.url;
    var token = url.substr(url.lastIndexOf("/") + 1, url.length);

    var user = require('./models/user');
    user.findOne({'google.token': token}).exec(function (err, user) {
      res.setHeader('Content-Type', 'application/json');
      if (!err) {
        res.send(JSON.stringify({user: user}));
      } else {
        res.send(JSON.stringify({user: null}))
      }
    })
  });
};