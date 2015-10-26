var express = require('express')
  , router = express.Router()
  , auth = require('../middlewares/auth')

router.get('/create', function(req, res) {
  res.render('product0/create', {layout: 'main'})
})

router.get('/browse', function(req, res) {
  res.render('product0/browse', {layout: 'main'})
})

module.exports = router