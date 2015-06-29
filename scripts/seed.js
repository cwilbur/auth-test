var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authTest');

var User = require('../lib/user.js');
var mockUsers = require('../lib//mockUsers.js');

var tasks = [];

tasks.push(function(done) {
  User.remove({}, done);
});

Object.keys(mockUsers).forEach(function(mockKey) {
  var mockUser = mockUsers[mockKey];
  tasks.push(

    function(done) {
      User.create({
        provider: 'local',
        githubId: mockUser.id,
        username: mockUser.username,
        password: 'NONE',
        displayName: mockUser.displayName,
        profileUrl: mockUser.profileUrl,
        emails: mockUser.emails
      }, function(error, user) {
        if (error) {
          console.error(error.message);
          console.error(error.stack);
        } else {
          console.log('user %s created', user.displayName);
          user.setPassword(user.username, done);
        }
      });
    }

  );
});

tasks.push(function(done) {
  User.create({
    githubId: 1832,
    username: 'cwilbur',
    displayName: 'Charlton Wilbur',
    profileUrl: 'https://www.github.com/cwilbur',
    emails: ['charlton.wilbur@generalassemb.ly']
  }, function(error, user) {
    console.log('user %s created', user.displayName);
    user.setPassword('abc123', done);
  });
});

async.series(tasks, function(error, result) {
  if (error) {
    console.log(error.stack);
  }
  mongoose.disconnect();
});
