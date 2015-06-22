var passport = require('passport');
var config = require('../config');
var User = require('./user.js')

if (config.env === 'production') {

  // github authentication only works in production

  var GitHubStrategy = require('passport-github2').Strategy;

  passport.use(new GitHubStrategy({
      clientID: config.secrets.GITHUB_CLIENT_ID,
      clientSecret: config.secrets.GITHUB_CLIENT_SECRET,
      callbackURL: config.authCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      User.update({
        githubId: profile.id
      }, {
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        lastLogin: Date.now()
      }, {
        upsert: true,
      }, function(err, response) {
        console.log(response);
        done(err, response);
      });
    }
  ));
}

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.find({
    _id: id
  }, done);
});


module.exports = passport;
