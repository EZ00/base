console.log("attached getZeroEffectTitle");

var getZeroEffectTitle = function(){
  console.log("Enter getZeroEffectTitle");
  var products = document.getElementsByClassName("product-item J-product-item");
  for(var i=0;i<products.length;i++){console.log(products[i].getElementsByClassName("products-name")[0].innerHTML.trim())}
  console.log("Leave getZeroEffectTitle");
}
