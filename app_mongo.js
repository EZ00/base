// Connect to Mongo on start
db.connect('mongodb://localhost:27010/base', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  }
  else{
  	var server = app.listen(port, function() {
  	  console.log('Listening on port ' + port);
  	})

  	var io = socketio(server);
  	//exports.io = io;

  	var nss = ['table'];
  	for(var i=0;i<nss.length;i++){
  	  var ns = require("./sockets/"+nss[i]);
  	  ns.regNs(io);
  	}
  }
})
