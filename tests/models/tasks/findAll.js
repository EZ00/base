var db = require('../../../db.js');
var env = require('../../../env');
var schema = require('../../../models/schemas/task.js');


//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Task = require('../../../models/tasks');
    Task.findAll(function(err,docs){
      if(err){
        console.error(err);
      }
      else{
        console.log(docs);
      }
    });
  }
})
