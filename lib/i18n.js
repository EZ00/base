var locales = require('../locales/index.js');

module.exports = function(colName,schema) {
  this.props = {};
  this.db = database;
	this.collectionName = colName;
  this.collection = this.db.collection(this.collectionName);
  //console.log('this.collection',this.collection);
  this.counters = this.db.collection(env.counter_collection);
  this.schema = schema;
};
module.exports.prototype = {
	extend: function(properties) {
		var Child = module.exports;
		Child.prototype = module.exports.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	setDB: function(db) {
		this.db = db;
	},
  insert: function(done){
    var newDoc = {};
    var waitCounter = 1;
    var eventCenter = new events.EventEmitter();
    eventCenter.on('d',function(){
      waitCounter = waitCounter - 1;
      if(waitCounter === 0){
        //insert the newDoc
        //console.log('this.collection',this);
        this.collection.insert(newDoc,function(err,doc){
          //inserted
          done();
        });
      }
    }.bind(this))
    for(var prop in this.schema){
      //init newDoc according to its type
      if(this.schema[prop] === 'string'){
        if(!(this.props[prop]==='undefined')){
          if(typeof this.props[prop] === 'string'){
            newDoc[prop] = this.props[prop];
          }
          else{
            console.error(prop+' is not a string.')
            done(prop+' is not a string.');
            return false;
          }
        }
        else{
          console.error('missing property: '+ prop);
          done('missing property: '+ prop)
          return false;
        }
      }
      else if(this.schema[prop] === 'autoInc'){
        waitCounter = waitCounter + 1;
        this.counters.findAndModify(
           { name: this.collectionName },
           [],
           { $inc: { seq: 1 } },
           {new: true,upsert: true},
           function(err,doc){
             if(err){
               console.log(err);
               done(err);
               return false;
             }
             //console.log(doc);
             eventCenter.emit('d');
             newDoc[prop]=doc.seq;
           }.bind(newDoc)
        );
      }
      else if(this.schema[prop] === 'userId'){
        newDoc[prop] = this.props[prop];
      }
      else if(this.schema[prop] === 'timeCreated'){
        newDoc[prop] = new Date();
      }
      else if(this.schema[prop] === 'timeModified'){
        newDoc[prop] = new Date();
      }
      else if(this.schema[prop] === 'password'){
        newDoc[prop] = bCrypt.hashSync(this.props[prop], bCrypt.genSaltSync(10), null);
      }
      else{
        console.error('the property ', prop, 'has a invalide type');
        done('the property ', prop, 'has a invalide type');
        return false;
      }
    }
    eventCenter.emit('d');
  },
  findOneById: function(id,done){
    var objectId = new ObjectID(id);
    this.collection.findOne({_id:objectId},function(err,doc){
      done(err,doc);
    })
  }
}
