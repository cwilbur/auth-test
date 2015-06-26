var config = require('./config.global.js');

// make any production-specific changes here

config.env = 'production';
config.hostname = 'intense-coast-5573.herokuapp.com';
config.serverPort = process.env.PORT; // heroku is particular

config.authCallbackUrl = 'https://intense-coast-5573.herokuapp.com/auth/github/callback';

// express settings

config.expressSettings = {
  'trust proxy': 1
};

// cookie settings

config.cookieOptions.secure = true;

// mongo database

config.mongo.username = 'stripey';
config.mongo.password = 'tigeriffic';
config.mongo.hosts = [{
  host: 'ds041327.mongolab.com',
  port: 41327
}];
config.mongo.db = 'guestbook';

module.exports = config;
