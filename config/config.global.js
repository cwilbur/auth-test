var config = {};

config.env = 'development';
config.hostname = 'localhost';
config.serverPort = 3000;

config.authCallbackUrl = '';

// extra app settings

config.expressSettings = {};

// cookies

config.cookieOptions = {};


// mongo database

config.mongo = {};
config.mongo.username = '';
config.mongo.password = '';
config.mongo.hosts = [{
  host: 'localhost',
  port: 27017
}];
config.mongo.db = 'guestbook';

// authentication keys & such that may vary from environment
// to environment but must never be committed to github
//
// may be stored in config/secrets.json
// but we prefer them in environment variables

config.secretNames = [
  'GITHUB_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'SESSION_KEY'
];

var jsonKeys = {};

try {
  var jsonKeys = require('./secrets.json');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    throw e;
  }
}

config.secrets = {};
config.secretNames.forEach(function(name) {
  if (process.env[name] !== undefined) {
    config.secrets[name] = process.env[name];
  } else if (jsonKeys[name] !== undefined) {
    config.secrets[name] = jsonKeys[name];
  } else {
    console.warn('No value found for secret %s', name);
  }
});

module.exports = config;
