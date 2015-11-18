//require('node-jsx').install({extension: '.js'});
var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/user/login');
}

module.exports = function(passport){
	router.use(isAuthenticated);
	router.get('/', function(req, res){
		var props = {user:req.user.username};
		var component = require('../../public/comp/responsive.js');
		var responsive = React.createFactory(component);
		//console.log('dashboard: ',req.user);
		res.render('dashboard/home',{
			component:
			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
			'\
			<script src="/static/comp/drawerMenu.js"></script>\
			<script src="/static/comp/headerContent.js"></script>\
			<script src="/static/comp/material_title_panel.js"></script>\
			<script src="/static/comp/verticalMenu.js"></script>\
			<script src="/static/comp/responsive.js"></script>\
			',
			react: ReactDOMServer.renderToString(responsive(props))
		});
	});
	//require('./databases')(app,passport);

	//router.use('/user', require('./users')(passport));
	router.use('/databases', require('./databases')(passport));
	router.use('/products', require('./products')(passport));
	router.use('/files', require('./files')(passport));
	router.use('/tasks', require('./tasks')(passport));
	router.use('/users', require('./users')(passport));
  router.use('/sub', require('./sub'));
	router.use('/test', require('./tests'));

	return router;
}
