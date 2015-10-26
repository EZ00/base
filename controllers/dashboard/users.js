var express = require('express');
var router = express.Router();
var React = require('react/addons');
var Users = require('../../models/users');
//var auth = require('../middlewares/auth')

module.exports = function(passport){
  router.get('/all', function(req, res) {
    Users.getUserNames(function(err,names){
      //console.log(names);
      res.send(JSON.stringify(names));
    })
  })

	return router;
}
