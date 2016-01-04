var db = require('../../../db.js');
var env = require('../../../env');
var schema = require('../../../models/schemas/test.js');

var max = 100;
var t0, t1;
//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var Test = require('../../../models/tests');
    var i=0;
    Test.props.creatorId = null;
    Test.props.creatorName = "null";
    var insertRecursion = function(n){
      Test.props.priority = n;
      Test.insert(function(err,doc){
        if(err){
          console.log(err);
        }
        else{
          i += 1;
          // console.log(doc);
          console.log("doc.id:",doc.doc.id,"doc.priority:",doc.doc.priority);
          if(i<max){
            insertRecursion(i);
          }
          else{
            t1 = Date.now();
            console.log(t1-t0);
          }
        }
      });
    }
    t0 = Date.now();
    insertRecursion(i);
  }
})

process.stdin.resume();
