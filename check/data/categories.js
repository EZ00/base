var db = require('../../db.js');
var env = require('../../env');
var ObjectID = require('mongodb').ObjectID;
var events = require('events');

//console.log('before connect to Mongo.')
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  }
  else {
    var eventCenter = new events.EventEmitter();
    var Category = require('../../models/categories');
    Category.subcount.findOne({name:Category.collectionName},function(err,subcount){
      console.log("subcount");
      console.log(subcount);
      var missFirst = false;
      var missLast = false;
      var missNumberDocs = [];
      if(!subcount.hasOwnProperty("first")){
        console.log("subcount miss prop: first");
        missFirst = true;
      }
      if(!subcount.hasOwnProperty("last")){
        console.log("subcount miss prop: last");
        missLast = true;
      }
      Category.findAll(function(err,docs){
        if(err){
          console.error(err);
        }
        else{
          console.log("Category.length:",Category.length);
          for(var i=0;i<docs.length;i++){
            if(!docs[i].hasOwnProperty("number")){
              console.log("miss prop: number");
              var missNumberDoc = {};
              missNumberDoc._id = docs[i]._id;
              missNumberDocs.push(missNumberDoc);
              console.log(docs[i]);
            }
          }
          // all miss prop number
          if(missNumberDocs.length === docs.length){
            console.log("all miss prop number");
            var upCount = 0;
            for(var i=0;i<missNumberDocs.length;i++){
              missNumberDocs[i].number = i;
              Category.collection.update({_id:missNumberDocs[i]._id},{$set:{number:missNumberDocs[i].number}},{},function(err,result){
                if(err){
                  console.error(err)
                }
                else{
                  upCount += 1;
                  console.log("updated number:",this._id,"->",this.number);
                  if(upCount === missNumberDocs.length){
                    Category.subcount.update({name:Category.collectionName},{$set:{first:0,last:missNumberDocs.length}},{},function(err,result){
                      if(err){
                        console.error(err)
                      }
                      else{
                        console.log("updated first: "+this.first +" and last: "+this.last);
                      }
                    }.bind({first:0,last:missNumberDocs.length-1}))
                  }
                }
              }.bind({_id:missNumberDocs[i]._id,number:missNumberDocs[i].number}))
            }
          }
        }
      })
    })
  }
})
