var mongoose = require('mongoose');
var credential = require('credential');
var userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    rquired: true,
    default: 'NOLOGIN'
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


userSchema.methods.setPassword = function(newPassword, next) {
  credential.hash(newPassword, function(error, hash) {
    if (error) {
      return next(error);
    } else {
      this.password = hash;
      this.save(next);
    }
  }.bind(this));
};

userSchema.methods.verifyPassword = function(testPasswrod, next) {
  credential.verify(this.password, testPasswrod, next);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
