var db = require('../../../db.js');
var env = require('../../../env');
var schema = require('../../../models/schemas/test.js');


//console.log('before connect to Mongo.')
var max = 100;
var count = 0;
var t0, t1;
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Test = require('../../../models/tests');
    t0 = Date.now();
    for(var i=0;i<max;i++){
      Test.props.priority = i;
      Test.props.creatorId = null;
      Test.props.creatorName = "null";
      Test.insert(function(err,doc){
        console.log("doc.id:",doc.doc.id,"doc.priority:",doc.doc.priority);
        count += 1;
        if(count===max){
          t1 = Date.now();
          console.log(t1-t0);
        }
      });
    }
  }
})

process.stdin.resume();
