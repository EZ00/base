var express = require('express');
var router = express.Router();
var i18n = require('../middlewares/i18n.js');
var Inquiry = require('../models/inquiries');
var fs = require("fs");
var jsdom = require("jsdom").jsdom;
var serializeDocument = require("jsdom").serializeDocument;
var document = jsdom("");
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

var isObject = function(obj){
  return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]'
}

var calcRowspan = function(obj){
    var n = 0;
    var total = 0;
    for(var i in obj){
        if(isObject(obj[i])){
            total += calcRowspan(obj[i]);
        }
        else{
            n += 1;
        }
    }
    return total+n;
}

var objToRows = function(elTbody,key,obj){
    var elTr = document.createElement("tr");
    var elTd = document.createElement("td");
    elTd.innerHTML = key;
    elTd.setAttribute("rowspan",calcRowspan(obj));
    elTr.appendChild(elTd);
    elTbody.appendChild(elTr);
}
var jsonToTable = function(data,style){
    var elTable = document.createElement("table");
		elTable.setAttribute("style",style);
    var elTbody = document.createElement("tbody");
    elTable.appendChild(elTbody);
    if(Array.isArray(data)){
        console.log("is array");
    }
    else{
        for(var key in data){
            if(isObject(data[key])){
                //objToRows(elTbody,key,data[key])
            }
            else{
            var trRow = document.createElement("tr");
            var trDataKey = document.createElement("td");
            var trDataValue = document.createElement("td");
            trDataKey.innerHTML = key;
            trDataValue.innerHTML = data[key];
            trRow.appendChild(trDataKey);
            trRow.appendChild(trDataValue);
            elTbody.appendChild(trRow);
            }
            //console.log(key,data[key]);
        }
        return elTable;
    }
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

	app.post('/requirement',function(req,res,next){
		Inquiry.props['creatorId'] = null;
		Inquiry.props['creatorName'] = 'customer';
		Inquiry.props['name'] = req.body.name;
		Inquiry.props['email'] = req.body.email;
		Inquiry.props['company'] = req.body.company;
		Inquiry.props['phone'] = req.body.phone;
		Inquiry.props['content'] = req.body.content;
		//console.log(Inquiry.props);
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
			var imgUrl = products[i]["images"][0] || "";
			imgUrl = "/uploads/"+imgUrl;
			imgThum.setAttribute("src",imgUrl);
			divItem.appendChild(imgThum);

			var divDesc = document.createElement("div");
			divDesc.setAttribute("class","desc");

			var aTitle = document.createElement("a");
			aTitle.setAttribute("href","/p/"+products[i].number+"/"+products[i].title.replace(/\s+/g, '-').toLowerCase());
			var h4Title = document.createElement("h4");
			h4Title.innerHTML = products[i].title;
			aTitle.appendChild(h4Title);
			divDesc.appendChild(aTitle);

			var divPmo = document.createElement("div");
			divPmo.setAttribute("class","pmo");
			var divPrice = document.createElement("div");
			divPrice.setAttribute("class","price");
			var priceUnits = products[i].priceUnit.split("/");
			divPrice.innerHTML = "Price: <b>"+products[i].priceMin+"-"+products[i].priceMax+" "+products[i].currency+" / "+priceUnits[0]+"</b>";
			divPmo.appendChild(divPrice);
			var divMoq = document.createElement("div");
			divMoq.setAttribute("class","moq");
			var moqUnits = products[i].moqUnit.split("/");
			divMoq.innerHTML = "MOQ: <b>"+products[i].moq+" "+moqUnits[1]+"</b>";
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
			// var divProfile = document.createElement("div");
			// divProfile.innerHTML = products[i].profile;
			// divDesc.appendChild(divProfile);
			divItem.appendChild(divDesc);
			divProducts.appendChild(divItem);
		}
	  //console.info(serializeDocument(doc));
	  //console.info(doc.documentElement.outerHTML);
	  //console.info(serializeDocument(divProducts));
	  //console.info(divProducts.outerHTML);
		res.render('front/products',{layout:'front.hbs',products:divProducts.outerHTML,title:'Products - Sunrise Industry Group'});
	})

	app.get('/p/:id/:title', function(req, res, next) {
		//<div style="overflow:auto;">
		// <ul id="thumbnails">
		//   <li>
		//     <a href="#slide1">
		//       <img src="/assets/img/image-1.jpg" alt="This is caption 1 <a href='#link'>Even with links!</a>">
		//     </a>
		//   </li>
		//   <li>
		//     <a href="#slide2">
		//       <img src="/assets/img/image-2.jpg"  alt="This is caption 2">
		//     </a>
		//   </li>
		//   <li>
		//     <a href="#slide3">
		//       <img src="/assets/img/image-3.jpg" alt="And this is some very long caption for slide 3. Yes, really long.">
		//     </a>
		//   </li>
		//   <li>
		//     <a href="#slide4">
		//       <img src="/assets/img/image-4.jpg" alt="And this is some very long caption for slide 4.">
		//     </a>
		//   </li>
		// </ul>
		// <div class="thumb-box">
		//   <ul class="thumbs">
		//     <li><a href="#1" data-slide="1"><img src="/assets/img/image-1.jpg" alt="This is caption 1 <a href='#link'>Even with links!</a>"></a></li>
		//     <li><a href="#2" data-slide="2"><img src="/assets/img/image-2.jpg"  alt="This is caption 2"></a></li>
		//     <li><a href="#3" data-slide="3"><img src="/assets/img/image-3.jpg" alt="And this is some very long caption for slide 3. Yes, really long."></a></li>
		//     <li><a href="#4" data-slide="4"><img src="/assets/img/image-4.jpg" alt="And this is some very long caption for slide 4."></a></li>
		//   </ul>
		// </div>

		// <div class="productDesc">
	  // <div style="display:inline-block;margin-left:20px;">
	  //   <div>
	  //     <h1 class="productTitle">cold rolled black annealed steel tube</h1>
	  //     <div class="metaContainer">
	  //       <div class="meta">
	  //         <div class="leftDiv">FOB Price:</div>
	  //         <div class="inlineBlock"><b>500-1000 USD</b></div>
	  //       </div>
	  //       <div class="meta">
	  //         <div class="leftDiv">Min Order Quantity:</div>
	  //         <div class="inlineBlock"><b>25 tons</b></div>
	  //       </div>
	  //       <div class="meta">
	  //         <div class="leftDiv">Supply Ability:</div>
	  //         <div class="inlineBlock"><b>6000 tons / month</b></div>
	  //       </div>
	  //       <div class="meta">
	  //         <div class="leftDiv">Port:</div>
	  //         <div class="inlineBlock"><b>Xingang Tianjin</b></div>
	  //       </div>
	  //       <div class="meta">
	  //         <div class="leftDiv">Payment Terms:</div>
	  //         <div class="inlineBlock"><b>L/C,T/T,Western Union,30% deposit inadvance <br/> <a href="/payments">view all payment terms</a></b></div>
	  //       </div>
	  //     </div>
	  //   </div>
	  // </div>
	  // <br/>
	  // <div class="quickContact">
	  //   <label>your name: </label>
	  //   <input type="text"></input>
	  //   <label>your email address: </label>
	  //   <input type="email"></input>
	  //   <label>your requirement:</label>
	  //   <textarea name="requirement" cols="40" rows="5" ></textarea>
	  //   <button class="btn btn-primary">Send</button>
	  // </div>
	  // </div>
		//</div>
	  console.log("Enter controller /p/:id/:title");
	  var id = Number(req.params.id);
		var product = null;
		for(var i=0;i<products.length;i++){
			if(products[i].number === id){
				product = products[i];
				break;
			}
		}
		if(product === null){
			next();
		}
		else{
			//var document = jsdom("");
			var ulThumnails = document.createElement("ul");
			ulThumnails.setAttribute("id","thumbnails");
			var divThumBox = document.createElement("div");
			divThumBox.setAttribute("class","thumb-box");
			var ulThumbs = document.createElement("ul");
			ulThumbs.setAttribute("class","thumbs");
			divThumBox.appendChild(ulThumbs);
			for(var i=0;i<product["images"].length;i++){
				var imgUrl = product["images"][i] || "";
				imgUrl = "/uploads/"+imgUrl;
				var liThum = document.createElement("li");
				var aThum = document.createElement("a");
				aThum.setAttribute("href","#slide"+(i+1));
				var imgThum = document.createElement("img");
				imgThum.setAttribute("src",imgUrl);
				imgThum.setAttribute("alt","");
				aThum.appendChild(imgThum);
				liThum.appendChild(aThum);
				ulThumnails.appendChild(liThum);

				var liThumb = document.createElement("li");
				var aThumb = document.createElement("a");
				aThumb.setAttribute("href","#"+(i+1));
				aThumb.setAttribute("data-slide",(i+1));
				var imgThumb = document.createElement("img");
				imgThumb.setAttribute("src",imgUrl);
				imgThumb.setAttribute("alt","");
				aThumb.appendChild(imgThumb);
				liThumb.appendChild(aThumb);
				ulThumbs.appendChild(liThumb);
			}
			var divSlide = document.createElement("div");
			divSlide.setAttribute("class","productSlide");
      divSlide.setAttribute("id","productSlide");
			divSlide.appendChild(ulThumnails);
			divSlide.appendChild(divThumBox);

			var priceUnits = product.priceUnit.split("/");
			var moqUnits = product.moqUnit.split("/");
			var supplyUnits = product.supplyUnit.split("/");

			var divProductDesc = document.createElement("div");
			divProductDesc.setAttribute("class","productDesc");
			divProductDesc.setAttribute("id","productDesc");
			var divTitleMeta = document.createElement("div");
			divTitleMeta.setAttribute("style","display:inline-block;margin-left:20px;");
			divProductDesc.appendChild(divTitleMeta);
			//<h1 class="productTitle">product.title</h1>
			var h1Title = document.createElement("h1");
			h1Title.setAttribute("class","productTitle");
			h1Title.innerHTML = product.title;
			divTitleMeta.appendChild(h1Title);
			//<div class="metaContainer">
			var divMetaContainer = document.createElement("div");
			divMetaContainer.setAttribute("class","metaContainer");
			divTitleMeta.appendChild(divMetaContainer);
			//       <div class="meta">
		  //         <div class="leftDiv">FOB Price:</div>
		  //         <div class="inlineBlock"><b>500-1000 USD</b></div>
		  //       </div>
			var divMetaPrice = document.createElement("div");
			divMetaPrice.setAttribute("class","meta");
			var divMetaPriceKey = document.createElement("div");
			divMetaPriceKey.setAttribute("class","leftDiv");
			divMetaPriceKey.innerHTML = "FOB Price:";
			var divMetaPriceValue = document.createElement("div");
			divMetaPriceValue.setAttribute("class","inlineBlock");
			divMetaPriceValue.innerHTML = "<b>"+ product.priceMin + "-" + product.priceMax + " " + product.currency + " / " +priceUnits[0]+"</b>"
			divMetaPrice.appendChild(divMetaPriceKey);
			divMetaPrice.appendChild(divMetaPriceValue);
			divMetaContainer.appendChild(divMetaPrice);
			//       <div class="meta">
		  //         <div class="leftDiv">Min Order Quantity:</div>
		  //         <div class="inlineBlock"><b>25 tons</b></div>
		  //       </div>
			var divMetaMoq = document.createElement("div");
			divMetaMoq.setAttribute("class","meta");
			var divMetaMoqKey = document.createElement("div");
			divMetaMoqKey.setAttribute("class","leftDiv");
			divMetaMoqKey.innerHTML = "Min Order Quantity:";
			var divMetaMoqValue = document.createElement("div");
			divMetaMoqValue.setAttribute("class","inlineBlock");
			divMetaMoqValue.innerHTML = "<b>"+ product.moq + " " + moqUnits[1]+"</b>"
			divMetaMoq.appendChild(divMetaMoqKey);
			divMetaMoq.appendChild(divMetaMoqValue);
			divMetaContainer.appendChild(divMetaMoq);
			//       <div class="meta">
		  //         <div class="leftDiv">Supply Ability:</div>
		  //         <div class="inlineBlock"><b>6000 tons / month</b></div>
		  //       </div>
			var divMetaSup = document.createElement("div");
			divMetaSup.setAttribute("class","meta");
			var divMetaSupKey = document.createElement("div");
			divMetaSupKey.setAttribute("class","leftDiv");
			divMetaSupKey.innerHTML = "Min Order Quantity:";
			var divMetaSupValue = document.createElement("div");
			divMetaSupValue.setAttribute("class","inlineBlock");
			divMetaSupValue.innerHTML = "<b>"+ product.supplyQuantity + " " + supplyUnits[0] + " / "+ product.supplyPeriod +"</b>";
			divMetaSup.appendChild(divMetaSupKey);
			divMetaSup.appendChild(divMetaSupValue);
			divMetaContainer.appendChild(divMetaSup);
			//       <div class="meta">
		  //         <div class="leftDiv">Supply Ability:</div>
		  //         <div class="inlineBlock"><b>6000 tons / month</b></div>
		  //       </div>
			var divMetaLeadTime = document.createElement("div");
			divMetaLeadTime.setAttribute("class","meta");
			var divMetaLeadTimeKey = document.createElement("div");
			divMetaLeadTimeKey.setAttribute("class","leftDiv");
			divMetaLeadTimeKey.innerHTML = "Lead time:";
			var divMetaLeadTimeValue = document.createElement("div");
			divMetaLeadTimeValue.setAttribute("class","inlineBlock");
			divMetaLeadTimeValue.innerHTML = "<b>"+ product.consignmentTerm+"</b>";
			divMetaLeadTime.appendChild(divMetaLeadTimeKey);
			divMetaLeadTime.appendChild(divMetaLeadTimeValue);
			divMetaContainer.appendChild(divMetaLeadTime);
			//       <div class="meta">
		  //         <div class="leftDiv">Port:</div>
		  //         <div class="inlineBlock"><b>Xingang Tianjin</b></div>
		  //       </div>
			var divMetaPort = document.createElement("div");
			divMetaPort.setAttribute("class","meta");
			divMetaPort.innerHTML = '<div class="leftDiv">Port:</div><div class="inlineBlock"><b>Xingang Tianjin</b></div>';
			divMetaContainer.appendChild(divMetaPort);
			//       <div class="meta">
		  //         <div class="leftDiv">Payment Terms:</div>
		  //         <div class="inlineBlock"><b>L/C,T/T,Western Union,30% deposit inadvance <br/> <a href="/payments">view all payment terms</a></b></div>
		  //       </div>
			var divMetaPay = document.createElement("div");
			divMetaPay.setAttribute("class","meta");
			divMetaPay.innerHTML = '<div class="leftDiv">Payment Terms:</div><div class="inlineBlock"><b>L/C,T/T,Western Union,30% deposit inadvance,Negotiable <br/> <a href="/faq#payment-terms">view all payment terms</a></b></div>';
			divMetaContainer.appendChild(divMetaPay);

			var brContact = document.createElement("br");
			divProductDesc.appendChild(brContact);

			//quickContact
			var quickContact = document.createElement("div");
			quickContact.setAttribute("class","quickContact");
			quickContact.innerHTML = '\
			<form action="/requirement" method="POST">\
			<div class="formGroupInline">\
			<label for="name">name: </label>\
			<span class="inputContainer"><input type="text" id="name" name="name" placeholder="your name" required="required"></input></span>\
			</div>\
			<div class="formGroupInline">\
			<label for="email">email address: </label>\
			<span class="inputContainer"><input type="email" id="email" name="email" placeholder="your email address" required="required"></input></span>\
			</div>\
			<div class="formGroupInline">\
			<label for="phone">phone: </label>\
			<span class="inputContainer"><input type="phone" id="phone" name="phone" placeholder="your phone number" required="required"></input></span>\
			</div>\
			<div class="formGroupInline">\
			<label for="company">company: </label>\
			<span class="inputContainer"><input type="text" id="company" name="company" placeholder="your company name" required="required"></input></span>\
			</div>\
			<label for="content">your requirement:</label>\
			<textarea cols="40" rows="5" id="content" name="content" placeholder="your requirement" required="required"></textarea>\
			<button class="btn btn-primary" id="btnSend" type="submit">Send</button>\
			</form>\
			'
			divProductDesc.appendChild(quickContact);

			//<div style="overflow:auto;">
			var divSlideDesc = document.createElement("div");
			divSlideDesc.setAttribute("style","overflow:auto;");
			divSlideDesc.appendChild(divSlide);
			divSlideDesc.appendChild(divProductDesc);

			var productDetails = "";

			var sectionTable = document.createElement("section");
			sectionTable.setAttribute("class","blockCenter textCenter");
			var h2TableTitle = document.createElement("h2");
			h2TableTitle.innerHTML = "Details in a table";
			sectionTable.appendChild(h2TableTitle);
			var tableContainer = document.createElement("div");
			tableContainer.setAttribute("class","inlineBlock");
      tableContainer.setAttribute("style","text-align:left");
			sectionTable.appendChild(tableContainer);
			//tableContainer.appendChild(jsonToTable(product.kvs,"text-align:left;padding-left:3px;padding-right:3px;"))
			tableContainer.innerHTML = product.content;
			productDetails += sectionTable.outerHTML;

			// var sectionShapes = document.createElement("section");
			// sectionShapes.setAttribute("class","sectionShapes blockCenter textCenter");
			// sectionShapes.innerHTML='\
			// <h2 class="textCenter">Section shapes</h2>\
	    // <div class="inlineBlock">\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/round-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">round</div>\
	    // </div>\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/square-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">square</div>\
	    // </div>\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/rectangle-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">rectangle</div>\
	    // </div>\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/stadium-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">stadium</div>\
	    // </div>\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/ellipse-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">ellipse</div>\
	    // </div>\
	    // <div class="sectionShape">\
	    //   <img src="/static/imgs/shapes/hexagon-notes1.png" class="shapeIcon"></img>\
	    //   <div class="shapeName">hexagon</div>\
	    // </div>\
	    // </div>\
	    // <div class="textCenter lead">\
	    //   For customized shapes, please <a href="/contact">contact us</a>\
	    // </div>';
			// productDetails += sectionShapes.outerHTML;

			// var sectionSizes = document.createElement("section");
			// sectionSizes.setAttribute("class","sizes blockCenter textCenter");
			// var h2SizesTitle = document.createElement("h2");
			// h2SizesTitle.innerHTML = "Sizes";
			// sectionSizes.appendChild(h2SizesTitle);
			// var sizesContainer = document.createElement("div");
			// sizesContainer.setAttribute("class","inlineBlock");
			// console.log("product.kvs.sizes",product.kvs.sizes);
			// for(var key in product.kvs.sizes){
			// 	console.log("key:",key);
			// 	var sizeContainer = document.createElement("div");
			// 	sizeContainer.setAttribute("class","sizeContainer inlineBlock");
			// 	var shapeName = document.createElement("div");
			// 	shapeName.setAttribute("class","textCenter shapeName");
			// 	shapeName.innerHTML = "<b>"+key+"</b>";
			// 	sizeContainer.appendChild(shapeName);
			// 	for(var prop in product.kvs.sizes[key]){
			// 		console.log("prop:",prop);
			// 		var divProp = document.createElement("div");
			// 		divProp.setAttribute("class","sizeProp textCenter");
			// 		divProp.innerHTML = prop +":"+ product.kvs.sizes[key][prop];
			// 		sizeContainer.appendChild(divProp);
			// 	}
			// 	sizesContainer.appendChild(sizeContainer);
			// }
			// sectionSizes.appendChild(sizesContainer);
			// productDetails += sectionSizes.outerHTML;

			res.render('front/item', {layout:"front.hbs",product:divSlideDesc.outerHTML,productDetails:productDetails,title:product.title+" - Sunrise Industry Group"});
		  console.log("Leave controller /p/:id/:title");
		}
	})

function renderSizes(container,sizes){
	console.log(sizes);
	var sectionSizes = document.createElement("section");
	sectionSizes.setAttribute("class","sizes blockCenter textCenter");
	var h2SizesTitle = document.createElement("h2");
	h2SizesTitle.innerHTML = "尺寸";
	sectionSizes.appendChild(h2SizesTitle);
	var sizesContainer = document.createElement("div");
	sizesContainer.setAttribute("class","inlineBlock");
	for(var key in sizes){
		console.log("key:",key);
		var sizeContainer = document.createElement("div");
		sizeContainer.setAttribute("class","sizeContainer inlineBlock");
		var shapeName = document.createElement("div");
		shapeName.setAttribute("class","textCenter shapeName");
		shapeName.innerHTML = "<b>"+key+"</b>";
		sizeContainer.appendChild(shapeName);
		for(var prop in sizes[key]){
			console.log("prop:",prop);
			var divProp = document.createElement("div");
			divProp.setAttribute("class","sizeProp textCenter");
			divProp.innerHTML = prop +":"+ sizes[key][prop];
			sizeContainer.appendChild(divProp);
		}
		sizesContainer.appendChild(sizeContainer);
	}
	sectionSizes.appendChild(sizesContainer);
	return sectionSizes.outerHTML;
	console.log(sectionSizes.outerHTML);
}
	app.get("/products_zh",function(req,res){
		var products_zh = JSON.parse(fs.readFileSync('./json/products_zh.js', 'utf8'));
		console.log(products_zh);
		var divProducts = "";
		var sectionShapes = document.createElement("section");
		sectionShapes.setAttribute("class","sectionShapes blockCenter textCenter");
		sectionShapes.innerHTML='\
		<h2 class="textCenter">截面形状</h2>\
		<div class="inlineBlock">\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/round-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">圆形</div>\
		</div>\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/square-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">正方形</div>\
		</div>\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/rectangle-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">矩形</div>\
		</div>\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/stadium-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">平椭圆</div>\
		</div>\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/ellipse-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">椭圆</div>\
		</div>\
		<div class="sectionShape">\
			<img src="/static/imgs/shapes/hexagon-notes1.png" class="shapeIcon"></img>\
			<div class="shapeName">六边形</div>\
		</div>\
		</div>';
		divProducts += sectionShapes.outerHTML;
    divProducts += '<section class="blockCenter textCenter"><h2>产品列表</h2></section>';

		for(var i=0; i<products_zh.length;i++){
			divProducts += '<section class="blockCenter"><div style="width:40%;margin-left:auto;margin-right:auto;margin-bottom:20px;">';
			divProducts += jsonToTable(products_zh[i],style="width:100%;").outerHTML;
			divProducts += '</div></section>';
		}

		//console.log(divProducts);
		res.render('front/products_zh', {layout:"front.hbs",products:divProducts,title:"Sunrise Industry Group"});
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
