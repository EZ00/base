var express = require('express');
var router = express.Router();
var React = require('react')
var ReactDOM = require('react-dom');
var Keywords = require('../../models/keywords');
//var auth = require('../middlewares/auth')

module.exports = function(passport){
  router.get('/', function(req, res,next){
    console.log('enter dashboard/keywords');
    var cb = function(err,docs){
      var props = {user:req.user.username,keywords:docs};
  		var component = require('../../public/comp/keywords/list.js');
  		var keywords = React.createFactory(component);
  		console.log('dashboard/keywords: ',req.user);
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
  			<script src="/static/comp/keywords.js"></script>\
  			',
  			react: ReactDOMServer.renderToString(keywords(props))
  		});
    }
    Keywords.findAll(cb);
	});

  //TODO: integrate to /create
  router.get('/create', function(req, res, next) {
    var props = {user:req.user.username};
		var component = require('../../public/comp/tasks/create.js');
		var tasks = React.createFactory(component);
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
			<script src="/static/comp/tasks/create.js"></script>\
			',
			react: ReactDOMServer.renderToString(tasks(props))
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
    			react: ReactDOMServer.renderToString(view(props))
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
    			react: ReactDOMServer.renderToString(edit(props))
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
