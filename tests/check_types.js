var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

Benchmark.prototype.setup = function() {
  function isValidDate_prototype(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]") {
      return false;
    }
    return !isNaN(d.getTime());
  }

  function isValidDate_new(d) {
    return new Date(d).getTime() > 0;
  }

  function isValidDate_new2(d) {
    return !isNaN(new Date(d).getTime());
  }
};

// add tests
suite.add('prototype', function() {
  isValidDate_prototype(new Date(2345));
  isValidDate_prototype(new Date(1421715310026));
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
.add('String#match', function() {
  !!'Hello World!'.match(/o/);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
