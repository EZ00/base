var express = require('express');
var router = express.Router();
var databases = require('../../models/databases');
var assert = require('assert');


module.exports = function(passport){
  router.get('/all', function(req, res) {
    databases.all(function(err,dbs){
      assert.equal(null, err);
      assert.ok(dbs.databases.length > 0);

      console.log(dbs);
      //res.render('product/create', {layout: 'main'})
    })
  })
  return router;
}
