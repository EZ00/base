var express = require('express');
var router = express.Router();
var i18n = require('../middlewares/i18n.js');
var Inquiry = require('../models/inquiries');
var fs = require("fs");
var jsdom = require("jsdom").jsdom;
var serializeDocument = require("jsdom").serializeDocument;
var products = JSON.parse(fs.readFileSync('./json/products.js', 'utf8'));
//console.log(products);
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
		// <div id="products" class="list-group">
		// 		<div class="item">
		// 			<img class="thumbnail" src="/static/images/C083.jpg" alt=""/>
		// 			<div class='desc'>
		// 				<a href='#'><h4>Square/Round Steel Pipe/Tube Cold Roll Forming Machine</h4></a>
		// 				<div class='pmo'>
		// 					<div class='price'>Price: <b>US $500-1000</b> / Ton</div>
		// 					<div class='moq'>MOQ: <b>10 Tons </b></div>
		// 				</div>
		// 				<div class='kvs'>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 					<div class='kv'>Thickness: <b>0.1mm-100mm</b></div>
		// 				</div>
		// 			</div>
		// 		</div>
		// </div>
		var document = jsdom("");
	  var divProducts = document.createElement("div");
		divProducts.setAttribute("id","products");
		divProducts.setAttribute("class","list-group");
		for(var i=0;i<products.length;i++){
			var divItem = document.createElement("div");
			divItem.setAttribute("class","item");

			var imgThum = document.createElement("img");
			imgThum.setAttribute("class","thumbnail");
			imgThum.setAttribute("src",products[i]["images"][0] || "");
			divItem.appendChild(imgThum);

			var divDesc = document.createElement("div");
			divDesc.setAttribute("class","desc");

			var aTitle = document.createElement("a");
			aTitle.setAttribute("href","#");
			var h4Title = document.createElement("h4");
			h4Title.innerHTML = products[i].title;
			aTitle.appendChild(h4Title);
			divDesc.appendChild(aTitle);

			var divPmo = document.createElement("div");
			divPmo.setAttribute("class","pmo");
			var divPrice = document.createElement("div");
			divPrice.setAttribute("class","price");
			var priceUnits = products[i].priceUnit.split("/");
			divPrice.innerHTML = "Price: <b>"+products[i].priceMin+"-"+products[i].priceMax+products[i].currency+" / "+priceUnits[0]+"</b>";
			divPmo.appendChild(divPrice);
			var divMoq = document.createElement("div");
			divMoq.setAttribute("class","moq");
			divMoq.innerHTML = "MOQ: <b>"+products[i].moq+" "+products[i].moqUnit+"</b>";
			divPmo.appendChild(divMoq);
			divDesc.appendChild(divPmo);

			var divKvs = document.createElement("div");
			divKvs.setAttribute("class","kvs");
			var j = 0;
			for(var key in products[i].kvs){
				var divKv = document.createElement("div");
				divKv.setAttribute("class","kv");
				divKv.innerHTML = key+": <b>"+products[i].kvs[key]+"</b>";
				divKvs.appendChild(divKv);
				j += 1;
				if(j === 6){
					break;
				}
			}
			divDesc.appendChild(divKvs);
			divItem.appendChild(divDesc);
			divProducts.appendChild(divItem);
		}
	  //console.info(serializeDocument(doc));
	  //console.info(doc.documentElement.outerHTML);
	  //console.info(serializeDocument(divProducts));
	  console.info(divProducts.outerHTML);
		res.render('front/products',{layout:'front.hbs',products:divProducts.outerHTML,title:'Products - Sunrise Industry Group'});
	})

	app.get('/p/:id/title', function(req, res) {
	  console.log("Enter controller /p/:id/title");
	  var id = req.params.id;
	  res.render('front/item', {layout: 'main'})
	  console.log("Leave controller /p/:id/title");
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
