var db = require('../db');
var assert = require('assert');

exports.all = function(cb) {
  // Use the admin database for the operation
  var adminDb = db.get().admin();

  // List all the available databases
  adminDb.listDatabases(function(err, dbs) {
    cb(err,dbs);
  });
}
