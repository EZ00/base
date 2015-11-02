var express = require('express')
var router = express.Router()
var i18n = require('../middlewares/i18n.js')
var Inquiry = require('../models/inquiries')
//var Comment = require('../models/comment')

//router.use('/comments', require('./comments'))



// router.get('/', function(req, res) {
  // Comments.all(function(err, comments) {
    // res.render('index', {comments: comments})
  // })
// })

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(app,passport){
  app.use(i18n);

	app.get('/',function(req,res){
		res.render('front/home',{layout:'front.hbs',react:'home',title:'Sunrise Industry Group - steel pipe manufacturer in china'});
	})

	app.get('/about',function(req,res){
		res.render('front/about',{layout:'front.hbs',react:'home',title:'About Us - Sunrise Industry Group'});
	})

  app.get('/faq',function(req,res){
		res.render('front/faq',{layout:'front.hbs',react:'home',title:'FAQ - Sunrise Industry Group'});
	})

	app.get('/contact',function(req,res){
		res.render('front/contact',{layout:'front.hbs',react:'home',title:'Contact Us - Sunrise Industry Group'});
	})

	app.get('/request-quote',function(req,res){
		res.render('front/quote',{layout:'front.hbs',react:'home',title:'Request a Quote - Sunrise Industry Group'});
	})

	app.post('/request-quote',function(req,res,next){
		//console.log(req.body);
		Inquiry.props['creatorId'] = null;
		Inquiry.props['creatorName'] = 'customer';
		Inquiry.props['name'] = req.body.name;
		Inquiry.props['email'] = req.body.email;
		Inquiry.props['company'] = req.body.company;
		Inquiry.props['phone'] = req.body.phone;
		Inquiry.props['content'] = req.body.content;
		Inquiry.insert();
		res.redirect('/');
	})

  app.get('/products',function(req,res){
		res.render('front/products',{layout:'front.hbs',react:'home',title:'Products - Sunrise Industry Group'});
	})

	var favicon = new Buffer('AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAWf4AAhr/AO77/wACIP8AACP/AAAm/wD5+fkALTrpAAA19gD//+cA/f/wABIb+QAfHdsA+vv/AAUs/wAAOP8AATj/AP/7/wAKNf8AAUT/AABH/wAAUP8AhKHpAAAg9wAAJvcABAQEAARi/wCGrPgA4Oj1AAct+gD9/f0A//39AABF+gAATfcA5ff1ALa+9wAJRPcAGD/fAARS/QAAWP0AzeX/AOfI+QADJfUA+Pj4AAAu/gAICAgAExn1ACEtvAAAN/4AAULyAABR+wAJUO8At7e3APLx/wADAwMAqqzwAAQg+QAAJf8A8//zAAIl/wADJf8A/fT2AA0Z/wD+/ucAAC7/AG1tbQD+8f8AAyv/AAAx/wAANP8A/Pz8AAgr/wD7//wAAD75AAwMDAABQP8AEjT2AIWY9QACW/8A/v/iAAcHBwCIr+kAAyr9AP3++gAPJ/0AAD/9ABg03ABaX+YAPj4+AAICAgABIf4A9v/sAAUl+AACKv4ABSz7APv7+wALCwsA//34AP38/gD///4A7e3tAHV1dQDx7/wA7P35AAIl8AAAI/wA9vb2APr68AAAKv8ABib8APv78wD4/fkA+f35APz2/wA4PNEA//z2AAE2/wAIMP8ABDb/AP/8/wD///8AAEL/AAEBAQAGUf8ABFT/ADNDwwAKHPoA9P/3AC8vLwD5/+4A+vr6APn/9wABNPoA/f36AOn47ABmdPoAEzn3AMvo/AAHYPcAACn+AP385gAKHf4A4eT5ABMz1AD//fIABS/+AAE1/gD+//gA//v+AP7+/gDZ2dkABkbyAABN/gCZsu0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlUFGNpZqNlAeeHgeK5VglWUeGUaVGXp4gIJZLUZkeHgGGXiVgkY0BkpZWB56X3pGeHh4eF94eHh4lR54X5WVRnh4eA0KHClmhwdzeHh4eHh4eHeGaDs5TH0JfplxeHh4eHhwF16ED3ZEkB1cI3h4eHh4PmySSZcbjCB0RwSDeHh4eFqRJTUCKHwUVUUFTXh4eHhUVhFbMooAmHkQXQt4eHiVbRZIUScaThUTMEMueHh4eAF1bjozJnshS5KLV3h4eHgqUohrf4kkMQ8sBIV4eHh4Z2kOEj2BPzcIA3JieHh4eHiOaTxAj0JPUy8feHh4eHh4YW8MOI0YImOUk3h4eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', 'base64');
  app.get("/favicon.ico", function(req, res) {
   res.statusCode = 200;
   res.setHeader('Content-Length', favicon.length);
   res.setHeader('Content-Type', 'image/x-icon');
   res.setHeader("Cache-Control", "public, max-age=2592000");                // expiers after a month
   res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
   res.end(favicon);
  });

	/* GET Home Page */
	// app.get('/home', isAuthenticated, function(req, res){
	// 	res.render('home', { user: req.user });
	// });

	//require('./users')(app,passport);
	app.use('/:lang/dashboard',require('./dashboard')(passport));

	app.use('/user',require('./users')(passport));

	//return router;
}

//module.exports = router
