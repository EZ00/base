var express = require('express');
var router = express.Router();
var jsdom = require("jsdom").jsdom;
var serializeDocument = require("jsdom").serializeDocument;

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/jsdom', function(req, res) {
  var doc = jsdom("");
  var div = doc.createElement("div");
  //console.info(serializeDocument(doc));
  //console.info(doc.documentElement.outerHTML);
  console.info(serializeDocument(div));
  console.info(div.outerHTML);
  res.render('test/jsdom');
});

module.exports = router;
