var passport = require('passport');
var LocalAuthStrategy = require('passport-local').Strategy;

var User = require('./user.js');

// the options that local strategy allows

var localAuthConfigOptions = {
  // usernameField: the form field or JSON attribute
  // containing the username, default 'username'
  //   usernameField: '',

  // passwordField: the form field or JSON attribute
  // containing the password, default 'password'
  //   passwordField: '',

  // session: should we enable session? default: true
  //   session: true

  // passReqToCallback: should we pass the request object
  // as the first argument to validateLogin? default: false
  //   passReqToCallback: fasle
};

var validateLogin = function(username, password, done) {

  User.findOne({
    username: username
  }, function(error, user) {
    if (error) {
      // an error occurred in database lookup; signal an error
      return done(error);
    } else if (!user) {
      // the username is not in the database; signal auth fail
      return done(null, false);
    } else {
      // we have a user - see if the password fits
      user.verifyPassword(password, function(error, isValid) {
        if (error) {
          // an error occurred during password verification; signal an error
          return done(error);
        } else if (!isValid) {
          // the password the user provided is wrong; signal auth fail
          return done(null, false);
        } else {
          // the password is correct; signal auth success by returning user
          done(null, user);
        }
      });
    }
  });
};


var localAuthStrategy = new LocalAuthStrategy(localAuthConfigOptions, validateLogin);

passport.use(localAuthStrategy);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }, function(error, user) {
    done(error, user);
  });
});

module.exports = passport;
