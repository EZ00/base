function CumtomEvent(name){
  this.name = name;
  this.callbacks = [];
}
CumtomEvent.prototype.registerCallback = function(callback){
  this.callbacks.push(callback);
}

function CustomReactor(){
  this.events = {};
}

CustomReactor.prototype.registerEvent = function(eventName){
  var event = new CumtomEvent(eventName);
  this.events[eventName] = event;
};

CustomReactor.prototype.dispatchEvent = function(eventName, eventArgs){
  this.events[eventName].callbacks.forEach(function(callback){
    callback(eventArgs);
  });
};

CustomReactor.prototype.addEventListener = function(eventName, callback){
  this.events[eventName].registerCallback(callback);
};

CustomReactor.prototype.on = function(eventName, callback){
  if(!this.events[eventName]){
    var event = new CumtomEvent(eventName);
    this.events[eventName] = event;
  }
  this.events[eventName].registerCallback(callback);
};

CustomReactor.prototype.emit = function(eventName, eventArgs){
  this.events[eventName].callbacks.forEach(function(callback){
    callback(eventArgs);
  });
};

var sockets = {};
var db = {};
var dbState = {inited:false};
var dbEvents = new CustomReactor();

sockets["db"] = io(window.location.host + "/db");

var dbClass = function(){
  this.docs = [];
}

dbClass.prototype = {
  init: function(docs){
    this.docs = docs;
  },
  toArray: function(){
    return this.docs;
  }
}

sockets.db.emit("all");
sockets.db.on("all",function(dbs){
  for(var i=0;i<dbs.length;i++){
    db[dbs[i]] = new dbClass();
  }
  console.log(db);
  dbState.inited = true;
  dbEvents.emit("inited");
})
