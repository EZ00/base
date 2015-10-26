var db = require('../db.js');
var env = require('../env');
var schema = require('../models/schemas/task.js');


//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Task = require('../models/tasks');
    Task.props.title = 'test Task Title';
    Task.props.content = 'test task content';
    Task.props.status = 'potential';
    Task.props.priority = 0;
    Task.props.assignee = [];
    Task.props.creatorId = null;
    Task.insert(function(err,doc){
      if(err){
        console.error(err);
      }
      else{
        //console.log(User);
        Task.collection.findOne({_id:doc._id},function(err,doc){
          if(err){
            console.error(err);
          }
          else{
            for(prop in schema) {
              console.log(prop+' = '+doc[prop]);
            }
            process.exit(0);
          }
        })
      }
    });
  }
})
