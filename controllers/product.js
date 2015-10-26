var express = require('express')
  , router = express.Router()
  , auth = require('../middlewares/auth')

router.get('/create', function(req, res) {
  res.render('product/create', {layout: 'main'})
})

router.get('/browse', function(req, res) {
  res.render('product/browse', {layout: 'main'})
})

module.exports = router