var express = require('express')
  , router = express.Router()
  , auth = require('../middlewares/auth')

router.get('/create', function(req, res) {
  res.render('product/create', {layout: 'main'})
})

router.get('/browse', function(req, res) {
  res.render('product/browse', {layout: 'main'})
})

router.get('/p/:id/title', function(req, res) {
  console.log("Enter controller /p/:id/title");
  console.log(req.params.id);
  res.render('product/item', {layout: 'main'})
  console.log("Leave controller /p/:id/title");
})

module.exports = router
