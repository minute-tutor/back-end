module.exports = function(app, usersCollection) {
  app.get('/user/*', function(req, res) {
    var url = req.url;
    var token = url.substr(url.lastIndexOf("/") + 1, url.length);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token: 1 }));
  })
};