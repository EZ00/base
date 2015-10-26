var express = require('express')
  , router = express.Router()

router.get('/', function(req, res) {
  res.render('home2', {layout: 'main1'})
})

module.exports = router
