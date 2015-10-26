var events = require('events');

var test = function(){
  var variable = 'value';
  var eventCenter = new events.EventEmitter();
  var waitCounter=1;
  eventCenter.on('d',function(){
    waitCounter = waitCounter-1;
    if(waitCounter===0){
      console.log(variable);
    }
  })
  for(var i=0;i<100;i++){
    if(i===50){
      waitCounter = waitCounter+1;
      setTimeout(function(){
          console.log('before end callback')
          eventCenter.emit('d');
      }, 1000)
    }
  }
  console.log('before end for');
  eventCenter.emit('d');
}

//console.log(variable);

test();
