var express = require('express'),
    app = module.exports = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    socket = require('socket.io'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    User = require('./api/models/userModel'),
    Room = require('./api/models/roomModel'),
    socketEvents = require('./socketEvents'),
    config = require('./api/controllers/config');


mongoose.Promise = global.Promise;
mongoose.connect(config.dburl);

var routes = require('./api/routes/apiRoutes');

app.set('superSecret', config.secret);

//middleware
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: config.secret,
    saveUninitialized: true,
    resave: false
}));

//Global variables
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

routes(app);
//setting port
server.listen(port, function(err){
    if(err){
        console.log("Couldn't connecto to port: " + port);
    }
    console.log('OVERCHAT API server started on: ' + port);
});
