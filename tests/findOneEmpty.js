var db = require('../db.js');
var env = require('../env');


//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else {
    var counters = db.collection('counters');
    counters.findOne({name:'note'},function(err,doc){
      console.log(doc);
    })
  }
})
