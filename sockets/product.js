var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var ObjectID = require('mongodb').ObjectID;
var Product = require('../models/products');

exports.regNs = function(io){
	var ns = io.of("/product");

	ns.on('connection',function(socket){
		var cookies = cookie.parse(socket.client.request.headers.cookie);
		//console.log(cookies);
		var connectSid = cookieParser.signedCookie(cookies['connect.sid'], env.secret);
		//console.log(connectSid);
		env.session_store.get(connectSid,function(err,session){
			//console.log(session.passport.user);
			var user = session.passport.user;
			if(user){
				socket.on("create",function(data){
		      console.log(data);
					for(var i=0;i<data.files.length;i++){
						fs.write('../uploads/data'+data.files[i].name,'data.files[i].buffer',function(err,name){
							if (err) throw err;
							console.log('It\'s saved!',name);
						}.bind(data.files[i].name));
					}
				});
        socket.on("edit",function(data){
		      //console.log(data);
				});
        socket.on("del",function(data){
		      console.log(data);
				});
			}
		})
	})
}
