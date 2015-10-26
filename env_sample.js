exports.port = process.env.PORT || 2999;
exports.secret = "thishould";
exports.mongo_url = 'mongodb://localhost:27010/passport';
exports.counter_collection = 'counters';
exports.langs = ['en','zh'];
exports.expressSession = require('express-session');
var MongoStore = require('connect-mongo')(this.expressSession);
exports.session_store = new MongoStore({
  url:this.mongo_url,
  collection: 'sessions',
  ttl: 14 * 24 * 60 * 60, // = 14 days. Default
  autoRemove: 'disabled',
  touchAfter: 24 * 3600 // time period in seconds
})
