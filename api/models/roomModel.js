'use strict';
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    "name": {
       type: String,
       required: [true, "Please provide a name"]
    },
    "owner": {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    "messages": [{
       type: String // WARNING must add reference to messageModel
    }],
    "members": [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }]
});

module.exports = mongoose.model('Rooms', RoomSchema);