var express = require('express');

var app = express();
app.set('view engine', 'jade');
app.set('views', './templates');

var jsonParser = require('body-parser').json();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authTest');

// LOGGING

var morgan = require('morgan');
app.use(morgan('dev'));

// SESSION AND SESSION STORE

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongoStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'webSessions'
});

app.use(session({
  store: mongoStore,
  secret: 'do be do waaaaah',
  resave: false,
  saveUninitialized: true
}));

// AUTHENTICATION

var passport = require('./lib/passport-local-auth.js');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('layout', {
    user: req.user
  });
});

// AUTHENTICATION ROUTES

app.post('/login', jsonParser);
app.post('/login', passport.authenticate('local'));
app.post('/login', function(req, res) {
  // at this point in the chain we are logged in
  // you can tell because req.user contains an object

  console.log(req.user);
  res.sendStatus(200);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// AUTHENTICATION ROUTES - REDIRECT

app.post('/login_redirect', jsonParser);
app.post('/login_redirect', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
}));


// REGISTRATION ROUTE

app.post('/register', jsonParser);
app.post('/register', function(res, req, next) {

});

app.use(express.static(__dirname + '/public'));


// ERROR HANDLER

app.use(function(err, req, res, next) {
  console.log(err.message);
  console.error(err.stack);
  res.sendStatus(500);
});

var server = app.listen(4000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
