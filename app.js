var env = require('./env');
//require("sockets/table.js");
var express = require('express');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var db = require('./db.js');
//var mongoose = require('mongoose');
// Configuring Passport
var passport = require('passport');

var app = express();

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

//mongoose.connect(dbConfig.url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static('public'));
app.use('/img', express.static('D:/imgs'));
app.use('/uploads', express.static('uploads'));

//app.set('view engine', 'jade');
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://127.0.0.1");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
};

app.use(allowCrossDomain);
// Connect to Mongo on start
db.connect(env.mongo_url, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.use(env.expressSession({
      secret: env.secret,
      resave: false,
      saveUninitialized: false,
      store: env.session_store
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    // Initialize Passport
    var initPassport = require('./passport/init');
    initPassport(passport);

    require('./controllers/index')(app,passport);
    app.use(function(req, res, next) {
      res.status(404).send('Status 404:<br/>Sorry cant find that!<br/>没找到！');
    });

    var server = app.listen(env.port, function() {
      console.log('Listening on port ' + env.port)
    })
    var io = socketio(server);

    var nss = ["db",'table','task','product','category','file','alitools'];
    for(var i=0;i<nss.length;i++){
      var ns = require("./sockets/"+nss[i]);
      ns.regNs(io);
    }
  }
})
