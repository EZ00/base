var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var ObjectID = require('mongodb').ObjectID;
var Product = require('../models/files');
var exec = require('child_process').exec
var util = require('util')
var Files = {};

exports.regNs = function(io){
	var ns = io.of("/file");

	ns.on('connection',function(socket){
		var cookies = cookie.parse(socket.client.request.headers.cookie);
		//console.log(cookies);
		var connectSid = cookieParser.signedCookie(cookies['connect.sid'], env.secret);
		//console.log(connectSid);
		env.session_store.get(connectSid,function(err,session){
			//console.log(session.passport.user);
			var user = session.passport.user;
			if(user){
				socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
					var Name = data['Name'];
					Files[Name] = {  //Create a new Entry in The Files Variable
						FileSize : data['Size'],
						Data	 : "",
						Downloaded : 0
					}
					var Place = 0;
					try{
						var Stat = fs.statSync('Temp/' +  Name);
						if(Stat.isFile())
						{
							Files[Name]['Downloaded'] = Stat.size;
							Place = Stat.size / 524288;
						}
					}
			  	catch(er){} //It's a New File
					fs.open("Temp/" + Name, 'a', 0755, function(err, fd){
						if(err)
						{
							console.log(err);
						}
						else
						{
							Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
							socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
						}
					});
			  });
				socket.on('Upload', function (data){
					var Name = data['Name'];
					Files[Name]['Downloaded'] += data['Data'].length;
					Files[Name]['Data'] += data['Data'];
					if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
					{
						fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
		          fs.rename("Temp/" + Name, "Video/" + Name, function(){
	              fs.unlink("Temp/" + Name, function (){
									fs.closeSync(Files[Name]['Handler']);
	                console.log("unlink this file:",Name );
	                socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
	              });
		          });
						});
					}
					else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
						fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
							Files[Name]['Data'] = ""; //Reset The Buffer
							var Place = Files[Name]['Downloaded'] / 524288;
							var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
							socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
						});
					}
					else
					{
						var Place = Files[Name]['Downloaded'] / 524288;
						var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
						socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
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
