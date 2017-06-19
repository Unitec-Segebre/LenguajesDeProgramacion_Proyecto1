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
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Messages'
    }],
    "members": [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }]
});

module.exports = mongoose.model('Rooms', RoomSchema);