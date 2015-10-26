var express = require('express')
  , router = express.Router()
  , auth = require('../middlewares/auth')

router.get('/create', function(req, res) {
  res.render('productcls/create', {layout: 'main'})
})

router.get('/browse', function(req, res) {
  res.render('productcls/browse', {layout: 'main'})
})

module.exports = router