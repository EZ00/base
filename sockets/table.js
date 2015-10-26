exports.regNs = function(io){
	var ns = io.of("/table");

	ns.on('connection',function(socket){
		socket.on("create",function(data){
      console.log(data);
			socket.emit("create",{"msg":"create table"})
		});
	})
}
