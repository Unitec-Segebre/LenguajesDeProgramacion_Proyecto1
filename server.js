//Scan project to replace var with let and delete unused variables
//Add bcrypt from: http://blog.slatepeak.com/refactoring-a-basic-authenticated-api-with-node-express-and-mongo/
var express = require('express'),
    app = module.exports = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    socket = require('socket.io'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    User = require('./api/models/userModel'),
    Room = require('./api/models/roomModel'),
    socketEvents = require('./socketEvents'),
    expressaValidator = require('express-validator'),
    expressSession = require('express-session'),
    config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Apidb');
app.set('superSecret', config.secret);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/apiRoutes');
routes(app);

server.listen(port, function(err){
    if(err){
        console.log("Couldn't connecto to port: " + port);
    }
    console.log('OVERCHAT API server started on: ' + port);
});

// for testing
module.exports = server;
module.exports = io;