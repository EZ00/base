var db = require('../db.js');
var env = require('../env');
var schemaObject = require('../models/schemas/object');

//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Model = require('../models/base');
    var newObject = new Model('objects',schemaObject);
    newObject.props.creatorId = 'null';
    newObject.insert();
  }
})
