var util = require('util');
var env = process.env.NODE_ENV || 'development';
var configFileName = './config.' + env + '.js';
var cfg = require(configFileName);

// at this point we have all the mongo information, so we
// can construct the connection url
//
// for reference:
//
// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

if (cfg.mongo) {

  var dbUri = 'mongodb://';

  var mongoUser = cfg.mongo && cfg.mongo.username;
  var mongoPass = cfg.mongo && cfg.mongo.password;
  if (mongoUser.length && mongoPass.length) {
    dbUri += util.format('%s:%s@', mongoUser, mongoPass);
  }

  if (cfg.mongo.hosts && cfg.mongo.hosts.length > 0) {
    dbUri += cfg.mongo.hosts.map(function(host) {
      return host.host + (host.port ? ':' + host.port : '');
    }).join(',') + '/';
  } else {
    // we supply a default
    dbUri += 'localhost/';
  }

  if (cfg.mongo.db) {
    dbUri += cfg.mongo.db;
  }

  cfg.mongo.uri = dbUri;
}

module.exports = cfg;
