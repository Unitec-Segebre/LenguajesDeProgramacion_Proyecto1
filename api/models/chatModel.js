'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    "loginAttemptCount": {
        type: Number,
        default: 0
    }
});