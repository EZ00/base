var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var ObjectID = require('mongodb').ObjectID;
var Task = require('../models/tasks');

exports.regNs = function(io){
	var ns = io.of("/task");

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
		      //console.log(data);
					for(var i=0;i<data.assignee.length;i++){
						data.assignee[i]._id = ObjectID(data.assignee[i]._id);
					}
					Task.props = data;
					Task.props.creatorId = user._id;
					Task.props.creatorName = user.username;
					//console.log(Task.props);
					Task.insert(function(err,r){
            console.log(r);
            if(!err){
              socket.emit("create",{err:null,id:r.doc.id});
            }
          });
				});
        socket.on("edit",function(data){
		      //console.log(data);
					for(var i=0;i<data.doc.assignee.length;i++){
						data.doc.assignee[i]._id = ObjectID(data.doc.assignee[i]._id);
					}
					var newDoc = data.doc;
					newDoc.editorId = user._id;
					newDoc.editorName = user.username;
					console.log(newDoc);
					console.log('oldStatus:'+data.oldStatus);
					console.log('id:'+data.id);
					Task.updateOneByLocalId(data.id,newDoc,data.oldStatus,function(err,r){
            // console.log(r);
            if(!err){
              socket.emit("edit",{err:null,id:r});
            }
          });
				});
        socket.on("del",function(data){
		      console.log(data);
          var _id = ObjectID(data._id);
          Task.deleteById(_id,data.status,function(err){
            if(err){
            }
            else{
              socket.emit("del",{'err':null,"msg":"delete task: "+data._id});
            }
          });
				});
			}
		})
	})
}
