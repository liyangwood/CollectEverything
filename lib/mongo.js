
var mongoskin = require('mongoskin');
var config = require('../config/config');

var db = mongoskin.db(config.mongoDBUrl+':'+config.mongoDBPort+'/'+config.mongoDBName);


exports.db = db;