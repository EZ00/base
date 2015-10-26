var express = require('express');
var router = express.Router();
var React = require('react/addons');
//var auth = require('../middlewares/auth')

module.exports = function(passport){

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
  	successRedirect: '/en/dashboard',
  	failureRedirect: '/user/login',
  	failureFlash : true
  }));

  /* GET login page. */
  router.get('/login', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

  /* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/user/login');
	});

  //TODO: integrate to /create
  router.get('/root', function(req, res, next) {
    //console.log('req.ip: '+req.ip);
    if(req.ip === '::ffff:127.0.0.1' || req.ip === '127.0.0.1'){
      var props = {user:'本地登录',message:req.flash('message')};
  		var component = require('../public/comp/root.js');
  		var root = React.createFactory(component);
      res.render('dashboard/home',{
  			component:
  			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
  			'\
  			<script src="/static/comp/drawerMenu.js"></script>\
  			<script src="/static/comp/headerContent.js"></script>\
  			<script src="/static/comp/material_title_panel.js"></script>\
  			<script src="/static/comp/verticalMenu.js"></script>\
        <script src="/static/comp/register.js"></script>\
  			<script src="/static/comp/root.js"></script>\
  			',
  			react: React.renderToString(root(props))
  		});
    }
    else{
      next();
    }
  })

  router.post('/root', function(req, res, next) {
    //console.log('req.ip: '+req.ip);
    if(req.ip === '::ffff:127.0.0.1' || req.ip === '127.0.0.1'){
      passport.authenticate('root', {
        successRedirect: '/en/dashboard',
        failureRedirect: '/user/root',
        failureFlash : true
      })(req, res, next);
    }
    else{
      next();
    }
  })

  /* GET Registration Page */
	router.get('/signup', function(req, res){
    if(req.ip === '::ffff:127.0.0.1' || req.ip === '127.0.0.1'){
      var props = {user:'本地登录',message:req.flash('message')};
  		var component = require('../public/comp/root.js');
  		var root = React.createFactory(component);
      res.render('dashboard/home',{
  			component:
  			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
  			'\
  			<script src="/static/comp/drawerMenu.js"></script>\
  			<script src="/static/comp/headerContent.js"></script>\
  			<script src="/static/comp/material_title_panel.js"></script>\
  			<script src="/static/comp/verticalMenu.js"></script>\
        <script src="/static/comp/register.js"></script>\
  			<script src="/static/comp/root.js"></script>\
  			',
  			react: React.renderToString(root(props))
  		});
    }
    else{
      next();
    }
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', function(req,res,next){
    if(req.user.isAdmin === true){
      passport.authenticate('signup', {
        successRedirect: '/en/dashboard',
        failureRedirect: '/user/signup',
        failureFlash : true
      })(req, res, next);
    }
    else{
      next();
    }
	}));

  router.get('/all', function(req, res) {
    res.send(JSON.stringify(['tom','max','jack','bilibili']));
  })

  router.get('/browse', function(req, res) {
    res.render('productcls/browse', {layout: 'main'})
  })

	return router;
}
