var fs = require('fs');
var mkdirp = require('mkdirp');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var Databases = require('../models/databases');

function splitPos(value, index) {
    return [value.substring(0, index),value.substring(index)];
}

exports.regNs = function(io){
	var ns = io.of("/db");

	ns.on('connection',function(socket){
		var cookies = cookie.parse(socket.client.request.headers.cookie);
		//console.log(cookies);
		var connectSid = cookieParser.signedCookie(cookies['connect.sid'], env.secret);
		//console.log(connectSid);
		env.session_store.get(connectSid,function(err,session){
			//console.log(session.passport.user);
			var user = session.passport.user;
			if(user){
        socket.on("all",function(data){
		      //console.log(data);
          Databases.allCollectionNames(function(err,names){
            if(err){
              console.error(err);
            }
            else if(names.length > 0){
              console.log(names);
              socket.emit("all",names);
            }
            else{
              console.error("names.length > 0 === false");
            }
          })
				});
			}
		})
	})
}
