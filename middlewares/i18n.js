var env = require('../env');

module.exports = function(req,res,next){
  //console.log('req.originalUrl = '+req.originalUrl);
  var url = req.originalUrl;
  //TODO: improve perf, use a regexp to extract the lang
  //TODO: create a middleware for this function
  var lang = url.split('?')[0].split('/')[1];
  //console.log('lang = '+lang);
  if(env.langs.indexOf(lang) > -1){
    req.lang = lang;
  }
  else{
    req.lang = 'en';
  }
  next();
}
