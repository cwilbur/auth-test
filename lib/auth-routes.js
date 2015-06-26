var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Entry = require('./entry.js');
var User = require('./user.js');
var passport = require('./passport.js');

router.get('/github',
  passport.authenticate('github', {
    scope: ['user:email']
  }));

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
  }),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
  });

router.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
