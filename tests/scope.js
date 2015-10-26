var prop = 1;

var cb = function(){
  var prop = 0;
  console.log('prop in callback function = ',prop);
}

prop = 2;

cb();
