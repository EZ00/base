var db = require('../db.js');
var env = require('../env');
var schema = require('../models/schemas/user.js');


//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var User = require('../models/users');
    User.props.username = 'thisIsAName';
    User.props.password = 'thisIsAPw123';
    User.props.creatorId = null;
    User.insert(function(err){
      if(err){
        console.error(err);
      }
      else{
        //console.log(User);
        User.collection.findOne({username:User.props.username},function(err,user){
          if(err){
            console.error(err);
          }
          else{
            for(prop in schema) {
              console.log(prop+' = '+user[prop]);
            }
            console.log(User.isValidPassword(user,User.props.password));
            process.exit(0);
          }
        })
      }
    });
  }
})
