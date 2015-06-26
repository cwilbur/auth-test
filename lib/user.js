var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  firstLogin: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lastLogin: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
