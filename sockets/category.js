var fs = require('fs');
var mkdirp = require('mkdirp');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var ObjectID = require('mongodb').ObjectID;
var Category = require('../models/categories');

function splitPos(value, index) {
    return [value.substring(0, index),value.substring(index)];
}

exports.regNs = function(io){
	var ns = io.of("/category");

	ns.on('connection',function(socket){
		var cookies = cookie.parse(socket.client.request.headers.cookie);
		//console.log(cookies);
		var connectSid = cookieParser.signedCookie(cookies['connect.sid'], env.secret);
		//console.log(connectSid);
		env.session_store.get(connectSid,function(err,session){
			//console.log(session.passport.user);
			var user = session.passport.user;
			if(user){
				socket.on("insert",function(data){
		      console.log(data);
          Category.props = data.doc;
          Category.props.creatorId = user._id;
          Category.props.creatorName = user.username;
          Category.insert(function(err,data){
            if(err){
              console.error(err);
            }
            else{
              socket.emit("create",{doc:data.doc});
            }
          });
				});
        socket.on("insertChild",function(data){
		      console.log(data);
          Category.props = data.doc;
          Category.props.creatorId = user._id;
          Category.props.creatorName = user.username;
          Category.insertChild(function(err,data){
            if(err){
              console.error(err);
            }
            else{
              socket.emit("create",{doc:data.doc});
            }
          });
				});
        socket.on("findFirstLevels",function(){
          console.log('findFirstLevels');
		      Category.findFirstLevels(function(err,docs){
            socket.emit('findFirstLevels',{docs:docs});
          });
				});
        socket.on("findAll",function(){
          console.log('findAll');
		      Category.findAll(function(err,docs){
            socket.emit('findAll',{docs:docs});
          });
				});
        socket.on("moveUp",function(data){
          console.log('moveUp');
		      Category.moveUp({_id:data._id},function(err,docs){
            socket.emit('set',{docs:docs});
          });
				});
        socket.on("moveDown",function(data){
          console.log('moveDown');
          console.log(data);
		      Category.moveDown({_id:data._id},function(err,docs){
            socket.emit('set',{docs:docs});
          });
				});
        socket.on("edit",function(data){
		      //console.log(data);
				});
        socket.on("remove",function(selected){
          console.log("Enter socket.on remove")
		      console.log(selected);
          Category.remove(selected,function(err,data){
            if(err){
              console.error(err);
            }
            else{
              socket.emit("remove",data);
            }
          })
          console.log("Leave socket.on remove")
				});
			}
		})
	})
}
