'use strict';
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    "name": {
       type: String,
       required: [true, "Please provide a name"]
    },
    "owner": {
        type: mongoose.Schema.ObjectId,
        ref: 'Users' //Check if is User instead of Users
    },
    "messages": [{
       type: String // WARNING must add reference to messageModel
    }],
    "members": [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users' //Check if is User instead of Users
    }]
});

mongoose.exports = mongoose.model('Rooms', RoomSchema);