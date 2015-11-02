var express = require('express');
var router = express.Router();
var React = require('react/addons');
var Products = require('../../models/products');
//var auth = require('../middlewares/auth')

module.exports = function(passport){
  router.get('/', function(req, res){
    var cb = function(err,docs,counter){
      var props = {user:req.user.username,products:docs,counter:counter};
  		var component = require('../../public/comp/products/list.js');
  		var products = React.createFactory(component);
  		//console.log('dashboard: ',req.user);
  		res.render('dashboard/home',{
  			component:
  			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
  			'\
        <script src="/socket.io/socket.io.js"></script>\
        <script src="/static/javascript/underscore-min.js"></script>\
        <script src="/static/javascript/moment-with-locales.min.js"></script>\
  			<script src="/static/comp/drawerMenu.js"></script>\
  			<script src="/static/comp/headerContent.js"></script>\
  			<script src="/static/comp/material_title_panel.js"></script>\
  			<script src="/static/comp/verticalMenu.js"></script>\
  			<script src="/static/comp/products/list.js"></script>\
  			',
  			react: React.renderToString(products(props))
  		});
    }
    Products.findAllAndCounter(null,cb);
	});

  //TODO: integrate to /create
  router.get('/create', function(req, res, next) {
    var props = {user:req.user.username};
		var component = require('../../public/comp/products/create.js');
		var products = React.createFactory(component);
		//console.log('dashboard: ',req.user);
		res.render('dashboard/home',{
			component:
			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
			'\
      <script src="/socket.io/socket.io.js"></script>\
      <script src="/static/javascript/jquery-2.1.4.min.js"></script>\
			<script src="/static/comp/drawerMenu.js"></script>\
			<script src="/static/comp/headerContent.js"></script>\
			<script src="/static/comp/material_title_panel.js"></script>\
			<script src="/static/comp/verticalMenu.js"></script>\
      <script src="/static/comp/tagsInput.js"></script>\
			<script src="/static/comp/products/create.js"></script>\
			',
			react: React.renderToString(products(props))
		});
  })

  router.get('/t/:id', function(req, res, next) {
    var cb = function(err,task){
      if(task){
        var props = {user:req.user.username,task:task};
    		var component = require('../../public/comp/tasks/view.js');
    		var view = React.createFactory(component);
    		//console.log('dashboard: ',req.user);
    		res.render('dashboard/home',{
    			component:
    			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
    			'\
          <script src="/socket.io/socket.io.js"></script>\
          <script src="/static/javascript/underscore-min.js"></script>\
          <script src="/static/javascript/moment-with-locales.min.js"></script>\
    			<script src="/static/comp/drawerMenu.js"></script>\
    			<script src="/static/comp/headerContent.js"></script>\
    			<script src="/static/comp/material_title_panel.js"></script>\
    			<script src="/static/comp/verticalMenu.js"></script>\
    			<script src="/static/comp/tasks/view.js"></script>\
    			',
    			react: React.renderToString(view(props))
    		});
      }
      else{
        next();
      }
    }
    Tasks.findOneByLocalId(Number(req.params.id),cb);
  })

  router.get('/edit/:id', function(req, res, next) {
    var cb = function(err,task){
      if(task){
        var props = {user:req.user.username,task:task};
    		var component = require('../../public/comp/tasks/edit.js');
    		var edit = React.createFactory(component);
    		//console.log('dashboard: ',req.user);
    		res.render('dashboard/home',{
    			component:
    			'<script>window.REACT_PROPS='+ JSON.stringify(props)+'</script>'+
    			'\
          <script src="/socket.io/socket.io.js"></script>\
          <script src="/static/javascript/jquery-2.1.4.min.js"></script>\
          <script src="/static/javascript/underscore-min.js"></script>\
    			<script src="/static/comp/drawerMenu.js"></script>\
    			<script src="/static/comp/headerContent.js"></script>\
    			<script src="/static/comp/material_title_panel.js"></script>\
    			<script src="/static/comp/verticalMenu.js"></script>\
          <script src="/static/comp/tagsInput.js"></script>\
    			<script src="/static/comp/tasks/edit.js"></script>\
    			',
    			react: React.renderToString(edit(props))
    		});
      }
      else{
        next();
      }
    }
    Tasks.findOneByLocalId(Number(req.params.id),cb);
  })

	return router;
}
