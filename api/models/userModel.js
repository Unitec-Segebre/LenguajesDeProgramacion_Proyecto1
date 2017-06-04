'use strict'; ///validate with json Schema and middleware
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    "username": {
        type: String,
        required: [true, 'Please select a username']
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
        required: true
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
    }]
});

module.exports = mongoose.model('Users', UserSchema);