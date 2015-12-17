console.log("attached getZeroEffectTitle");
socket = io("http://127.0.0.1:2999/alitools");
socket.on('connect',function() {
  console.log('Client has connected to the server!');
});
var gotoPage = function(){
  var Jpagination = document.getElementById("J-pagination");
  var uiPaginationNavi = Jpagination.getElementsByClassName("ui-pagination-navi")[0];
  var uiPaginationNext = uiPaginationNavi.getElementsByClassName("ui-pagination-next")[0];
  var maxPage = Number(uiPaginationNext.previousSibling.previousSibling.textContent);
  console.log(maxPage);

  var uiPaginationGoto = Jpagination.getElementsByClassName("ui-pagination-goto")[0];
  var uiPaginationInput = uiPaginationGoto.getElementsByTagName("input")[0];
  var uiPaginationSubmit = uiPaginationGoto.getElementsByTagName("button")[0];
  uiPaginationInput.value = 2;
  uiPaginationSubmit.click();
}
var getZeroEffectProducts = function(query){
  seajs.iuse("//i.alicdn.com/ida-mydata/common/bridge/bridge.js")(function(Bridge){
		Bridge.Jquery.ajax({
			type : 'POST',
			url : server + 'self/.json?action=CommonAction&iName=getIneffectiveProducts' + '&' + Math.random(),
			data : query,
			success : function(result){
				if(null == result || !result.successed){
					return;
				}
				var data = null;
				try{
					data = result.value;
				}catch(e){}
				if (null == data || 0 == data.total) {
					return;
				}
        else{
          console.log(data);
          socket.emit("logZeroEffectProducts",data);
          if(this.query.pageNO*this.query.pageSize < data.total){
            this.query.pageNO += 1;
            getZeroEffectProducts(this.query);
          }
        }
			}.bind({query:query})
		});
  });
}
var getZeroEffectTitle = function(){
  console.log("Enter getZeroEffectTitle");
  var products = document.getElementsByClassName("product-item J-product-item");
  for(var i=0;i<products.length;i++){console.log(products[i].getElementsByClassName("products-name")[0].innerHTML.trim())}
  console.log("Leave getZeroEffectTitle");
}

var elEvent = document.getElementById("event");
// Listen for the event.
elEvent.addEventListener('build', function (e) { getZeroEffectProducts({
  orderBy: "time",
  orderModel:	"desc",
  selected:	0,
  statisticsType:"day",
  pageSize : 10,
  pageNO : 1,
  time : 150
}); }, false);
