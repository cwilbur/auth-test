var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authTest');

var User = require('../lib/user.js');
var mockUsers = require('../lib//mockUsers.js');

var userIds = {};
var tasks = [];

tasks.push(function(done) {
  User.remove({}, done);
});

var createCreateUserFunction = function(user) {
  return function(done) {
    var origPass = user.password;
    User.create(user, function(error, user) {
      console.log('user %s created', user.displayName);
      userIds[user.username] = user._id;
      user.setPassword(user.username, done);
    });
  };
};

var createCreateLanguageFunction = function(language) {
  return function(done) {
    ProgrammingLanguage.create(language, function(error, language) {
      console.log('language %s created', language.name);
      languageIds[language.keyName] = language._id;
    });
  };
};


var bindUserAndLanguage = function(user, language) {
  // set up the circular references
  Language.

}

// make some user associations
// to provoke circular reference problems



Object.keys(mockUsers).forEach(function(mockKey) {
  tasks.push(createCreateUserFunction(mockUsers[mockKey]));
});


async.series(tasks, function(error, result) {
  if (error) {
    console.log(error.stack);
  }
  mongoose.disconnect();
});
