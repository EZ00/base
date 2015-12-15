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
	var ns = io.of("/alitools");

	ns.on('connection',function(socket){
		socket.emit('connect');
	})
}
