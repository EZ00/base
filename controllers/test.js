var express = require('express')
  , router = express.Router()
  , auth = require('../middlewares/auth')

router.get('/chart', function(req, res) {
  res.render('test/chart', {layout: 'main'})
})

module.exports = router