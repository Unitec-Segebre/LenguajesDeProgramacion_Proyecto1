//validate with json Schema and middleware
//add timestamp and relations as in: http://blog.slatepeak.com/creating-a-real-time-chat-api-with-node-express-socket-io-and-mongodb/
'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    "username": {
        type: String,
        required: [true, 'Please select a username'],
        unique: [true, 'Sorry, this username is taken']
    },
    "name": {
        type: String,
        required: [true, 'Please provide your name']
    },
    "password": {
        type: String, ///////Change to correct type////Add authentication//////////////////////
        required: true
    },
    "profilePicture": {
        type: String, /////////////////Change to correct type/////////////////////////
        required: false
    },
    "email": {
        type: String,
        lowercase: true,
        required: true,
        unique: [true, 'Sorry, this email is already associated with an existing account']
    },
    "loginAttemptCount": {
        type: Number,
        default: 0
    },
    "isActive": {
        type: Boolean,
        default: true
    },
    "friends": [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    "rooms": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms'
    }]
});

module.exports = mongoose.model('Users', UserSchema);