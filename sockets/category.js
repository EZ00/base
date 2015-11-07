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
				socket.on("create",function(data){
		      //console.log(data);
					for(var i=0;i<data.files.length;i++){
						var file = data.files[i];
						var filePath = splitPos(file.sha256,2);
						var dirName = './files/'+filePath[0];
						mkdirp(dirName,function(err){
							if (err) console.log(err);
							fs.writeFile(this.dirName+'/'+this.filePath[1]+'.'+this.file.ext,this.file.buffer,function(err){
								if (err) console.log(err);
								//console.log('It\'s saved!',this.file.name);
								var newFile = {};
								newFile.name = this.file.name;
								newFile.ext = this.file.ext;
								newFile.sha256 = this.file.sha256;
								newFile.size = this.file.size;
								newFile.type = this.file.type;
								File.props = newFile;
								File.props.creatorId = user._id;
								File.props.creatorName = user.username;
								File.insert();
						  }.bind(this));
						}.bind({file:file,filePath:filePath,dirName:dirName}))
					}
				});
        socket.on("findFirstLevels",function(){
          console.log('findFirstLevels');
		      Category.findFirstLevels(function(err,docs){
            socket.emit('findFirstLevels',{docs:docs});
          });
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
