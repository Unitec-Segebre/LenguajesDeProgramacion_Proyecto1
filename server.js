var express = require('express'),
    app = module.exports = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    expressSession = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    socket = require('socket.io'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    User = require('./api/models/userModel'),
    Room = require('./api/models/roomModel'),
    socketEvents = require('./socketEvents'),
    config = require('./api/controllers/config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db);

app.set('superSecret', config.secret);

//middleware
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//initializing express session
app.use(expressSession({
    secret: config.secret,
    saveUninitialized: true,
    resave: true
}));

//initializing passport
app.use(passport.initialize());
app.use(passport.session({secret: config.secret, resave: false, saveUninitialized: true}));

//initializing express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Global variables
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

var routes = require('./api/routes/apiRoutes');
routes(app);

//setting port
server.listen(port, function(err){
    if(err){
        console.log("Couldn't connecto to port: " + port);
    }
    console.log('OVERCHAT API server started on: ' + port);
});
