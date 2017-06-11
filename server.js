'use strict';
var express = require('express'),
    app = module.exports = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    User = require('./api/models/userModel'),
    Message = require('./api/models/messageModel'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Apidb');
app.set('superSecret', config.secret);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

var routes = require('./api/routes/apiRoutes');
routes(app);


app.listen(port);


console.log('RESTful API server started on: ' + port);