var socket = io.connect(window.location.host + "/table")

socket.emit('create',{'msg':'hello'})

socket.on('create',function(data){
  console.log(data);
})