var db = require('../../db.js');
var env = require('../../env');
var schema = require('../../models/schemas/task.js');


//console.log('before connect to Mongo.')
db.connect(env.mongo_test_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Test = db.collection("test");
    Test.insert({number:0},function(err,result){
      if(err){
        console.error(err);
      }
      else{
        var obj = {number:0};
        Test.update({number:0},{$set:obj},function(err){
          if(err){
            console.error(err);
          }
        });
      }
    });
  }
})
