var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/guestbook');

var User = require('../lib/user.js');
var Entry = require('../lib/entry.js');

var peopleIds = {};

async.series([

    function(done) {
      User.remove({}, done);
    },

    function(done) {
      Entry.remove({}, done);
    },

    function(done) {
      User.create({
        username: 'cwilbur@github.com',
        displayName: 'Charlton Wilbur'
      }, function(error, user) {
        peopleIds.cwilbur = user._id;
        done();
      });
    },
    function(done) {
      User.create({
        username: 'rintintin@github.com',
        displayName: 'Rin Tin Tin'
      }, function(error, user) {
        peopleIds.rintintin = user._id;
        done();
      });
    },
    function(done) {
      Entry.create({
        user: peopleIds.cwilbur,
        comment: 'Welcome to my guestbook.'
      }, done);
    },
    function(done) {
      Entry.create({
        user: peopleIds.rintintin,
        comment: 'Woof!  Arf arf arf.  [tailwag]'
      }, done);
    }
  ],

  function(error, result) {
    mongoose.disconnect();
  }
);
