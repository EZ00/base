var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var env = require('../env');
var ObjectID = require('mongodb').ObjectID;
var IneffectiveProduct = require('../models/ineffectiveProducts');
var exec = require('child_process').exec
var util = require('util')
var Files = {};

exports.regNs = function(io){
	var ns = io.of("/alitools");

	ns.on('connection',function(socket){
		socket.emit('connect');
    socket.on("logZeroEffectProducts",function(data){
      console.log(data.pageNO);
      var products = data.data;
      for(var i=0;i<products.length;i++){
        var p = products[i];
        IneffectiveProduct.props['creatorId'] = null;
        IneffectiveProduct.props['creatorName'] = "小李";
        IneffectiveProduct.props['firstName'] = p.firstName;
        IneffectiveProduct.props['gmtModify'] = p.gmtModify;
        IneffectiveProduct.props['aid'] = p.id;
        IneffectiveProduct.props['imageURL'] = p.imageURL;
        IneffectiveProduct.props['isDeletedInP4P'] = p.isDeletedInP4P;
        IneffectiveProduct.props['isKwSearch'] = p.isKwSearch;
        IneffectiveProduct.props['isP4PProduct'] = p.isP4PProduct;
        IneffectiveProduct.props['isShowcase'] = p.isShowcase;
        IneffectiveProduct.props['lastName'] = p.lastName;
        IneffectiveProduct.props['noeffDays'] = p.noeffDays;
        IneffectiveProduct.props['sid'] = p.sid;
        IneffectiveProduct.props['subject'] = p.subject;
        IneffectiveProduct.insert();
      }
    })
	})
}
