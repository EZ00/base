var env = require('../env');
var glob = require('glob');

var locales = {};
for lang in env.langs{
  var filenames = glob.sync('./*.'+lang+'.js');
  var locale = {};
  for f in filenames{
    var obj = require(f);
    for prop in obj{
      locale[prop] = obj[prop];
    }
  }
  locales[lang]=locale;
}

module.exports = locales;
